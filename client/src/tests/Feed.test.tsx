import { graphql } from "msw";
import { setupServer } from "msw/node";
// We're using our own custom render function and not RTL's render.
// Our custom utils also re-export everything from RTL
// so we can import fireEvent and screen here as well
import { render, fireEvent, screen, act, waitFor } from "../test-utils";
import App from "../App";
import { store } from "../store";

// We use msw to intercept the network request during the test,
// and return the response 'John Smith' after 150ms
// when receiving a get request to the `/api/user` endpoint
export const handlers = [
  graphql.query("GET_FEED", (req, res, ctx) => {
    return res(
      ctx.data({
        feed: [],
      })
    );
  }),
  graphql.query("GET_CURR_USER", (req, res, ctx) => {
    return res(
      ctx.data({
        getCurrentUser: {
          id: 1,
          username: "anon",
          email: "example@test.com",
        },
      })
    );
  }),
];

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: any) => {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    },
  });
  server.listen();
});

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

test("View meme page from feed", async () => {
  await act(async () => {
    render(<App />, {
      store,
      preloadedState: {
        memes: {
          entities: {},
          ids: [],
        },
        users: {
          entities: {},
          ids: [],
        },
      },
    });

    /**
     * Check if the feed container is visible
     */
    expect(screen.getByTestId("feed-content")).toBeVisible();

    /**
     * Check if the create meme fab is visible
     */
    expect(screen.getByTestId("create-meme-fab")).toBeVisible();
  });
});
