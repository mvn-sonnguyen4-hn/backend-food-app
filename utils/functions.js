const pagination = (page, limit, total) => {
  const totalPage = Math.ceil(total / limit);
  if (page > totalPage) {
    return {
      status: 500,
      msg: "Page not found",
    };
  }
  return {
    status: 200,
    msg: "Success",
    page:Number(page),
    totalPage,
  };
};

module.exports= {pagination}