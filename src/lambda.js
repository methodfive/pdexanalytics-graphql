import {startServerAndCreateLambdaHandler, handlers} from "@as-integrations/aws-lambda";

import {resolvers} from "./graphql/resolvers.js";
import {typeDefs} from "./graphql/typeDefs.js";
import {ApolloServer} from "@apollo/server";
import {CORS_ORIGINS} from "./constants.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: false,
  playground: false
});

const corsMiddleware = async (event) => {

  const origin = event.headers.origin;

  //console.dir(event, { depth: 5 });

  if (origin) { //} && CORS_ORIGINS.includes(origin)) {
    return (result) => {
      result.headers = {
        ...result.headers,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "*"
      };

      if (event.requestContext.http.method === "OPTIONS") {
        result.body = undefined;
        result.statusCode = 204;
      }

      //console.dir(result, { depth: 5 });
      return Promise.resolve();
    };
  }
  return () => Promise.resolve();
};

const requestHandler = handlers.createAPIGatewayProxyEventV2RequestHandler();

export const handler = startServerAndCreateLambdaHandler(
    server,
    requestHandler,
    {
      middleware: [corsMiddleware],
    }
);