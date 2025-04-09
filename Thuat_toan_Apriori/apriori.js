function getUniqueItems(transactions) {
  const items = new Set();
  transactions.forEach((transaction) => {
    transaction.forEach((item) => items.add(item));
  });
  return Array.from(items);
}

function generateItemsets(items) {
  const itemsets = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      itemsets.push([items[i], items[j]]);
    }
  }
  return itemsets;
}

function calculateSupport(transactions, itemset) {
  let count = 0;
  transactions.forEach((transaction) => {
    if (itemset.every((item) => transaction.includes(item))) {
      count++;
    }
  });
  return count / transactions.length;
}

function aprioriAlgorithm(transactions, minSupport) {
  const uniqueItems = getUniqueItems(transactions);
  let itemsets = generateItemsets(uniqueItems);

  const frequentItemsets = [];
  itemsets.forEach((itemset) => {
    const support = calculateSupport(transactions, itemset);
    if (support >= minSupport) {
      frequentItemsets.push({ itemset, support });
    }
  });

  return frequentItemsets;
}

function generateAssociationRules(
  frequentItemsets,
  transactions,
  minConfidence
) {
  const rules = [];
  frequentItemsets.forEach((itemsetData) => {
    const itemset = itemsetData.itemset;
    const support = itemsetData.support;
    itemset.forEach((item, idx) => {
      const antecedent = itemset.filter((_, i) => i !== idx);
      const antecedentSupport = calculateSupport(transactions, antecedent);
      const confidence = support / antecedentSupport;
      if (confidence >= minConfidence) {
        rules.push({
          antecedent,
          consequent: [item],
          confidence,
        });
      }
    });
  });
  return rules;
}

function parseInput() {
  const input = document.getElementById("transactions").value.trim();
  const transactions = input
    .split("\n")
    .map((line) => line.split(",").map((item) => item.trim()));
  return transactions;
}

function populateFrequentItemsetsTable(frequentItemsets) {
  const tableBody = document.getElementById("frequent-itemsets");
  tableBody.innerHTML = "";

  frequentItemsets.forEach((itemsetData) => {
    const row = document.createElement("tr");

    const itemsetCell = document.createElement("td");
    itemsetCell.textContent = itemsetData.itemset.join(", ");
    row.appendChild(itemsetCell);

    const supportCell = document.createElement("td");
    supportCell.textContent = itemsetData.support.toFixed(4);
    row.appendChild(supportCell);

    tableBody.appendChild(row);
  });
}

function populateAssociationRulesTable(associationRules) {
  const tableBody = document.getElementById("association-rules");
  tableBody.innerHTML = "";

  associationRules.forEach((rule) => {
    const row = document.createElement("tr");

    const antecedentCell = document.createElement("td");
    antecedentCell.textContent = rule.antecedent.join(", ");
    row.appendChild(antecedentCell);

    const consequentCell = document.createElement("td");
    consequentCell.textContent = rule.consequent.join(", ");
    row.appendChild(consequentCell);

    const confidenceCell = document.createElement("td");
    confidenceCell.textContent = rule.confidence.toFixed(4);
    row.appendChild(confidenceCell);

    tableBody.appendChild(row);
  });
}

function runApriori() {
  const transactions = parseInput();
  if (transactions.length === 0) {
    alert("Please enter some transactions.");
    return;
  }

  const minSupport = parseFloat(document.getElementById("minSupport").value);
  const minConfidence = parseFloat(
    document.getElementById("minConfidence").value
  );

  const frequentItemsets = aprioriAlgorithm(transactions, minSupport);

  const associationRules = generateAssociationRules(
    frequentItemsets,
    transactions,
    minConfidence
  );

  populateFrequentItemsetsTable(frequentItemsets);
  populateAssociationRulesTable(associationRules);
}
