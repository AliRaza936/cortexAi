import proxy from "express-http-proxy";

export const proxyWithHeader = (serviceUrl) => {
  return proxy(serviceUrl, {
    timeout: 120000,

    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      }

      return proxyReqOpts;
    },

    proxyErrorHandler: (err, res, next) => {
      console.error("[Gateway Proxy Error]", {
        message: err.message,
        code: err.code,
        name: err.name,
      });

      next(err);
    },
  });
};