function DataValidator(...data) {
  let undefinedData = false;

  data.forEach((item) => {
    if (!item) {
      undefinedData = true;
    }
  });

  return undefinedData ? false : true;
}

module.exports = DataValidator;
