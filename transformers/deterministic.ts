import * as ts from "typescript"

const kindToName = (kind: ts.SyntaxKind): string => {
  return ts.SyntaxKind[kind]
}

const inJSX = (node: ts.Node): boolean =>
  node.parent.kind === ts.SyntaxKind.JsxExpression

const isFunctionLiteral = (node: ts.Node) =>
  node.kind === ts.SyntaxKind.ArrowFunction ||
  node.kind === ts.SyntaxKind.FunctionExpression

const isNonDeterministic = (node: ts.Node): boolean => {
  if (
    node.parent.kind === ts.SyntaxKind.JsxExpression &&
    isFunctionLiteral(node)
    // TODO array map
  ) {
    return true
  }
  return false
}

const createDiagnosticFrom = (node: ts.Node): ts.DiagnosticWithLocation => {
  return {
    category: ts.DiagnosticCategory.Error,
    code: 0, // TODO
    file: node.getSourceFile(),
    length: 0, // TODO
    messageText: "all expression must be deterministic",
    start: node.getStart(),
  }
}

const formatDiagnostic = (diag: ts.DiagnosticWithLocation): string => {
  const { line, character } = ts.getLineAndCharacterOfPosition(
    diag.file,
    diag.start
  )
  return `${diag.file.fileName}:${line + 1}:${character + 1}:${
    diag.messageText
  }`
}

const deterministicTypeChecker = (
  checker: ts.TypeChecker,
  pluginOptions: {}
): ts.TransformerFactory<ts.SourceFile> => {
  return (ctx: ts.TransformationContext) => {
    return (file: ts.SourceFile) => {
      const visitor = (node: ts.Node): ts.Node => {
        if (
          node.kind === ts.SyntaxKind.CallExpression ||
          node.kind === ts.SyntaxKind.FunctionExpression ||
          node.kind === ts.SyntaxKind.ArrowFunction
        ) {
          const t = checker.getTypeAtLocation(node)
          console.debug(
            `---> node.kind:${ts.SyntaxKind[node.kind]} inJSX?:${inJSX(
              node
            )} node:${JSON.stringify(
              node.getText()
            )} parentNode:${JSON.stringify({
              kind: node.parent.kind,
              text: node.parent.getText(),
            })}`
          )
        }
        if (isNonDeterministic(node)) {
          const diagnostic = createDiagnosticFrom(node)
          console.error(formatDiagnostic(diagnostic))
        }

        return ts.visitEachChild(node, visitor, ctx)
      }
      return ts.visitEachChild(file, visitor, ctx)
    }
  }
}
export default deterministicTypeChecker
