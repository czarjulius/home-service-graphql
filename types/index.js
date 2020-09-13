import _ from "lodash";
import user from "./user/resolver";

// const schemaObject = () => Promise.all(['user', 'entry'].map(loadTypeSchema));

const resolvers = _.merge({}, user, entry);

export { resolvers };
