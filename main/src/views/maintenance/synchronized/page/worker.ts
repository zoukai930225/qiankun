self.onmessage = (e: any) => {
  const serializedData = JSON.parse(JSON.stringify(e.data));
  const { data, action, search } = serializedData;

  if (action === 'search') {
    const filtered: any = data.filter((ds: any) => ds.productName.includes(search.productName) && ds.productNumber.includes(search.productNumber) && ds.goodsId.includes(search.goodsId))
    self.postMessage(filtered)
  }

  // if (action === 'set') {
  //   const sorted = [...data].sort((a, b) =>
  //     a.name.localeCompare(b.name)
  //   )
  //   self.postMessage(sorted)
  // }

};