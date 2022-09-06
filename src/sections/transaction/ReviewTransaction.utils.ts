export interface TransactionMeta {
  name: string
  args: {
    name: string
    type: string
    typeName: string
  }[]
}

export function getTransactionJSON(meta: TransactionMeta, data: string[]) {
  return {
    name: `${meta.name}(${meta.args.map((arg) => arg.name).join(", ")})`,
    code: meta.args.reduce((acc, cur, index) => {
      return {
        ...acc,
        [cur.name]: data[index],
      }
    }, {}),
  }
}
