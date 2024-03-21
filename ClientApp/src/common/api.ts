import axios, { AxiosResponse } from 'axios';

export type HttpMethod = "get" | "put" | "post" | "delete" | "upload" | "download" | "downpost";

const api: <T>(
  method: HttpMethod,
  url: string,
  params: {} | [] | FormData
) => Promise<AxiosResponse<T, any>> = (method, url, params) => {
  if (!url.startsWith("/api"))
    url = `/api${!url.startsWith("/") ? "/" + url : url}`;
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
  };
  
  switch (method) {
    case "get":
      return axios.get(url, { params, headers: headers });
    case "put":
      return axios.put(url, params, { headers: headers });
    case "post":
      return axios.post(url, params, { headers: headers });
    case "delete":
      return axios.delete(url, { params, headers: headers });
    case "upload":
      const uploadHeaders = {...headers, ...{ "Content-Type": "multipart/form-data" }};
      return axios.put(url, params, { headers: uploadHeaders });
    case "download":
      return axios.get(url, { params, headers: headers, responseType: "blob" });
    case "downpost":
      return axios.post(url, params, { headers: headers, responseType: "blob" });
    }
};

axios.interceptors.response.use(response => {
  return response;
},
error => {
  if(error.response?.data == "TokenExpired"){
    if(localStorage.getItem("auth-token")){
      localStorage.removeItem("auth-token");
      alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
      window.location.reload();
      return;
    }
  }

  throw error;
});

export default api;