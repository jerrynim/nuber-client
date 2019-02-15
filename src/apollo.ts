import ApolloClient, { Operation } from "apollo-boost";

/* 아폴로 로컬스테이트 세팅*/
const client = new ApolloClient({
  clientState: {
    defaults: {
      auth: {
        __typename: "Auth",
        isloggedIn: Boolean(localStorage.getItem("jwt"))
      }
    },
    resolvers: {
      Mutation: {
        logUserIn: (_, { token }, { cache }) => {
          localStorage.setItem("jwt", token);
          cache.writeData({
            auth: {
              __typename: "Auth",
              isLoggedIn: true
            }
          });
          return null;
        },
        logUserOut: (_, __, { cache }) => {
          localStorage.removeItem("jwt");
          cache.writeData({
            data: {
              __typename: "Auth",
              isLoggedIn: false
            }
          });
          return null;
        }
      }
    }
  },
  /* 모든 요청 헤더에 X-JWT를 붙이는 것 */
  request: async (operation: Operation) => {
    operation.setContext({
      headers: {
        "X-JWT": localStorage.getItem("jwt") || ""
      }
    });
  },
  uri: "http://localhost:4000/graphql"
});
export default client;
