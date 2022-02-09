import React from "react";
import { render as rtlRender, screen } from "@testing-library/react";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { RootState } from "./store";

function render(
  ui: Parameters<typeof rtlRender>[0],
  {
    preloadedState,
    store,
    ...renderOptions
  }: {
    preloadedState: RootState;
    store: EnhancedStore<any, any, any>;
  }
) {
  const Wrapper: React.FC = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from "@testing-library/react";
// override render method
export { render, screen };
