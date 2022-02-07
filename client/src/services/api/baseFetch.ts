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

  async postQuery<QueryResponse>(query: string): Promise<QueryResponse> {
    const baseQuery: BaseQuery = {
      query,
    };

    const queryRes = await axios.post<BaseResponse<QueryResponse>>(
      this.baseUri,
      baseQuery,
      await this.constructQueryConfig()
    );

    const res = queryRes.data;

    return res.data;
  }
}

export const baseFetch = new BaseFetch(appConfig.API_BASE_URI);
