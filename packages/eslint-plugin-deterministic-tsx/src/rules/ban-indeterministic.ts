import { Rule } from "eslint";

const rule: Rule.RuleModule={
  create(ctx: Rule.RuleContext):Rule.RuleListener{
    return {}
  },
  meta: {},
}
export default rule
