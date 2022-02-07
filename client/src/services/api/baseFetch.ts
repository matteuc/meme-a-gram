import axios, { AxiosRequestConfig } from "axios";
import { appConfig } from "../../config";
import { authService } from "../auth";

interface BaseResponse<T> {
  data: T;
  errors: Array<{
    message: string;
  }>;
}

interface BaseQuery {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

class BaseFetch {
  baseUri: string;

  constructor(baseUri: string) {
    this.baseUri = baseUri.endsWith("/")
      ? `${baseUri}graphql}`
      : `${baseUri}/graphql`;
  }

  async constructQueryConfig(): Promise<AxiosRequestConfig> {
    const sessionInfo = await authService.getCurrentUserSession();

    const headers: AxiosRequestConfig["headers"] = {};

    if (sessionInfo) {
      headers["Authorization"] = sessionInfo.idToken;
    }

    return {
      headers,
    };
  }

  async postQuery<QueryResponse>(
    query: string,
    operationName?: string,
    variables?: Record<string, any>
  ): Promise<QueryResponse> {
    const baseQuery: BaseQuery = {
      query,
      variables: variables || {},
      operationName: operationName || undefined,
    };

    const queryRes = await axios.post<BaseResponse<QueryResponse>>(
      this.baseUri,
      baseQuery,
      await this.constructQueryConfig()
    );

    const res = queryRes.data;

    if (res.errors) {
      console.error(res.errors);
      throw new Error(
        `Query execution failed for ${operationName}`
      );
    }

    return res.data;
  }
}

export const baseFetch = new BaseFetch(appConfig.API_BASE_URI);
