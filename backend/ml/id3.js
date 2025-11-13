/*
 * ID3 Decision Tree Algorithm Implementation
 * This module exports functions for building and using ID3 decision trees.
 */

/**
 * Counts the frequency of each unique value for a given attribute in a dataset.
 * @param {Array<Object>} data The dataset (array of objects).
 * @param {string} attribute The attribute name (key in the objects).
 * @returns {Object} A map of value -> count.
 */
export function countFrequencies(data, attribute) {
  const counts = {};
  for (const example of data) {
    const value = example[attribute];
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

/**
 * Calculates the Entropy of the dataset based on the target attribute.
 * @param {Array<Object>} data The dataset.
 * @param {string} targetAttr The name of the target/class attribute.
 * @returns {number} The calculated entropy.
 */
export function calculateEntropy(data, targetAttr) {
  if (data.length === 0) {
    return 0; // No data, no impurity
  }
  const classCounts = countFrequencies(data, targetAttr);
  const totalExamples = data.length;
  let entropy = 0;

  for (const count of Object.values(classCounts)) {
    const probability = count / totalExamples;
    // Handle log2(0) case: p * log2(p) is 0 when p is 0.
    // Since we only iterate over counts > 0, we don't need a special check here.
    entropy -= probability * Math.log2(probability);
  }
  return entropy;
}

/**
 * Splits the dataset into subsets based on the values of a given attribute.
 * @param {Array<Object>} data The dataset.
 * @param {string} attribute The attribute name to split on.
 * @returns {Object<string, Array<Object>>} A map of attribute_value -> subset_data.
 */
export function splitData(data, attribute) {
  const subsets = {};
  for (const example of data) {
    const value = example[attribute];
    if (!subsets[value]) {
      subsets[value] = [];
    }
    subsets[value].push(example);
  }
  return subsets;
}

/**
 * Calculates the Information Gain for splitting the dataset by a given attribute.
 * @param {Array<Object>} data The dataset.
 * @param {string} attribute The attribute to calculate gain for.
 * @param {string} targetAttr The target attribute name.
 * @returns {number} The calculated Information Gain.
 */
export function calculateInformationGain(data, attribute, targetAttr) {
  const initialEntropy = calculateEntropy(data, targetAttr);
  const subsets = splitData(data, attribute);
  const totalExamples = data.length;
  let remainingEntropy = 0;

  for (const subsetData of Object.values(subsets)) {
    const proportion = subsetData.length / totalExamples;
    const subsetEntropy = calculateEntropy(subsetData, targetAttr);
    remainingEntropy += proportion * subsetEntropy;
  }

  return initialEntropy - remainingEntropy;
}

/**
 * Finds the attribute that results in the highest Information Gain.
 * @param {Array<Object>} data The dataset.
 * @param {Array<string>} attributes The list of attributes to consider (excluding target).
 * @param {string} targetAttr The target attribute name.
 * @returns {string | null} The best attribute name, or null if no attributes are left.
 */
export function findBestSplitAttribute(data, attributes, targetAttr) {
  let maxGain = -Infinity;
  let bestAttribute = null;

  for (const attribute of attributes) {
    const gain = calculateInformationGain(data, attribute, targetAttr);

    // Check for ties: we can just pick the first one found.
    if (gain > maxGain) {
      maxGain = gain;
      bestAttribute = attribute;
    }
  }

  return bestAttribute;
}

/**
 * Finds the most frequent class in a dataset.
 * @param {Array<Object>} data The dataset.
 * @param {string} targetAttr The target attribute name.
 * @returns {string} The majority class label.
 */
export function getMajorityClass(data, targetAttr) {
  const classCounts = countFrequencies(data, targetAttr);
  let majorityClass = null;
  let maxCount = -1;

  for (const [className, count] of Object.entries(classCounts)) {
    if (count > maxCount) {
      maxCount = count;
      majorityClass = className;
    }
  }
  return majorityClass;
}

/**
 * Recursively builds the ID3 decision tree.
 * @param {Array<Object>} data The current subset of the training data.
 * @param {Array<string>} availableAttributes The attributes remaining to be split on.
 * @param {string} targetAttr The target attribute name.
 * @param {Array<Object>} fullTrainingData Optional full training data for majority class fallback.
 * @returns {Object} The tree node (internal node or leaf node).
 */
export function buildID3Tree(
  data,
  availableAttributes,
  targetAttr,
  fullTrainingData = null,
) {
  // 1. **Base Case 1: All examples are of the same class (Pure Node)**
  // If the entropy is 0, we have a pure set.
  if (calculateEntropy(data, targetAttr) === 0) {
    // The class is the value of the target attribute of the first example
    return { type: "leaf", class: data[0][targetAttr] };
  }

  // 2. **Base Case 2: No attributes left**
  if (availableAttributes.length === 0) {
    // Return a leaf node with the majority class
    return { type: "leaf", class: getMajorityClass(data, targetAttr) };
  }

  // 3. **Recursive Step: Find the best split**
  const bestAttribute = findBestSplitAttribute(
    data,
    availableAttributes,
    targetAttr,
  );

  // If bestAttribute is null (e.g., all remaining attributes have 0 gain), use majority class
  if (!bestAttribute) {
    return { type: "leaf", class: getMajorityClass(data, targetAttr) };
  }

  // Create a new node for the tree
  const tree = {
    type: "node",
    attribute: bestAttribute,
    children: {},
  };

  // Remove the chosen attribute from the list for the next recursive calls
  const remainingAttributes = availableAttributes.filter(
    (attr) => attr !== bestAttribute,
  );
  const subsets = splitData(data, bestAttribute);

  // 4. **Recursive Call for each subset**
  for (const [value, subset] of Object.entries(subsets)) {
    // If the subset is empty (unlikely with this data structure, but good for robustness),
    // it becomes a leaf node of the majority class of the parent data.
    if (subset.length === 0) {
      tree.children[value] = {
        type: "leaf",
        class: getMajorityClass(data, targetAttr),
      };
    } else {
      // Build the subtree recursively
      tree.children[value] = buildID3Tree(
        subset,
        remainingAttributes,
        targetAttr,
        fullTrainingData || data,
      );
    }
  }

  return tree;
}

/**
 * Classifies an example using a decision tree.
 * @param {Object} tree The decision tree to use for classification.
 * @param {Object} example The example to classify.
 * @param {Array<Object>} fullTrainingData Optional full training data for majority class fallback.
 * @param {string} targetAttr The target attribute name for fallback.
 * @returns {string} The predicted class.
 */
export function classify(
  tree,
  example,
  fullTrainingData = null,
  targetAttr = null,
) {
  // If it's a leaf node, return the classification
  if (tree.type === "leaf") {
    return tree.class;
  }

  // It's an internal node. Get the attribute value for the current example.
  const attributeValue = example[tree.attribute];

  // Find the corresponding branch (child)
  const nextNode = tree.children[attributeValue];

  // Handle cases where the example has a value not seen in training
  if (!nextNode) {
    // Fallback to majority class when encountering unseen attribute values
    // Fallback: return the majority class if training data is provided
    if (fullTrainingData && targetAttr) {
      return getMajorityClass(fullTrainingData, targetAttr);
    }
    // If no fallback available, return null
    return null;
  }

  // Recurse down the tree
  return classify(nextNode, example, fullTrainingData, targetAttr);
}

/**
 * Predicts the college for a student using the training data.
 * @param {Object} studentData The student data to predict for.
 * @param {Array<Object>} trainingData The training dataset.
 * @param {string} targetAttribute The target attribute name (default: "College").
 * @returns {string} The predicted college.
 */
export function predict(
  studentData,
  trainingData,
  targetAttribute = "College",
) {
  if (!trainingData || trainingData.length === 0) {
    throw new Error("Training data is required for prediction");
  }

  // Get all attributes except the target and 'Tier' (if present in dataset)
  const allAttributes = Object.keys(trainingData[0]).filter(
    (attr) => attr !== targetAttribute && attr !== 'Tier',
  );

  // Build the decision tree
  const decisionTree = buildID3Tree(
    trainingData,
    allAttributes,
    targetAttribute,
    trainingData,
  );

  // Classify the student data
  const prediction = classify(
    decisionTree,
    studentData,
    trainingData,
    targetAttribute,
  );

  return prediction;
}
