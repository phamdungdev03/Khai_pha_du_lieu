function parseTransactions(input) {
    return input
      .trim()
      .split("\n")
      .map((line) =>
        line
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== "")
      );
  }
  
  function getFrequentItems(transactions, minSupport) {
    const itemCounts = {};
    const totalTransactions = transactions.length;
  
    // Đếm từng item
    transactions.forEach((transaction) => {
      const uniqueItems = [...new Set(transaction)];
      uniqueItems.forEach((item) => {
        itemCounts[item] = (itemCounts[item] || 0) + 1;
      });
    });
  
    // Lọc theo support
    const frequentItems = {};
    Object.entries(itemCounts).forEach(([item, count]) => {
      const support = count / totalTransactions;
      if (support >= minSupport) {
        frequentItems[item] = support;
      }
    });
  
    return frequentItems;
  }
  
  function runFPGrowth() {
    const rawInput = document.getElementById("transactions").value;
    const minSupport = parseFloat(document.getElementById("minSupport").value);
    const transactions = parseTransactions(rawInput);
  
    const frequentItems = getFrequentItems(transactions, minSupport);
  
    // Hiển thị kết quả
    const output = document.getElementById("frequent-itemsets");
    output.innerHTML = "";
  
    Object.entries(frequentItems).forEach(([item, support]) => {
      const row = `<tr>
          <td>{ ${item} }</td>
          <td>${support.toFixed(2)}</td>
        </tr>`;
      output.innerHTML += row;
    });
  }
  