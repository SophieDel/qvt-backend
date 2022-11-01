function transformOrdinalAnswerToNormalizedNumericAnswer(
  answer,
  answersChoiceArray
) {
  // Transforme une catégorie ordinale en une note comprise entre 0 et 1
  // Formule de normalisation : (value - xmin)/(xmax - xmin).
  // Ici, xmin = 0 (c'est le premier indice de l'array), donc on aura : indexAnswer/maxIndex
  // avec maxIndex : answersChoiceArray.length - 1
  let indexAnswer = answersChoiceArray.findIndex((a) => a === answer);
  return indexAnswer / (answersChoiceArray.length - 1);
}

function meanByTheme(arrayOfObject, groupName, valueName) {
  // On fait la moyenne des notes obtenues pour un groupe de thèmes.
  // Intérêt de l'objet : unique entrée par thème
  let objectByTheme = arrayOfObject.reduce((acc, val) => {
    const key = val[groupName];
    if (!acc[key]) {
      acc[key] = {};
      acc[key]["count"] = 0;
      acc[key]["total"] = val[valueName];
    }
    acc[key]["count"] += 1;
    acc[key]["total"] += val[valueName];
    return acc;
  }, {});

  // Transformationn de l'objet en un tableau
  let arrayMeanByTheme = [];
  for (let i = 0; i < Object.keys(objectByTheme).length; i++) {
    let key = Object.keys(objectByTheme)[i];
    let obj = {
      theme: key,
      note: objectByTheme[key]["total"] / objectByTheme[key]["count"],
    };
    arrayMeanByTheme.push(obj);
  }
  return arrayMeanByTheme;
}

function defineProfile(
  answersArray,
  intitulesArray,
  groupName = "theme",
  valueName = "note"
) {
  let normalizeNumericAnswers = [];
  // On associe une la note à son thème
  for (let i = 0; i < answersArray.length; i++) {
    let normalizedMark = transformOrdinalAnswerToNormalizedNumericAnswer(
      answersArray[i],
      Object.values(intitulesArray[i])[0]["reponse"]
    );
    let ob = {
      theme: Object.values(intitulesArray[i])[0][groupName],
      note: normalizedMark,
    };
    normalizeNumericAnswers.push(ob);
  }
  // On fait la moyenne par thème
  let meansByThemeArray = meanByTheme(
    normalizeNumericAnswers,
    groupName,
    valueName
  );
  // On prend le thème associé à la note la plus élevée
  let maxMarkObject = meansByThemeArray.reduce((acc, val) => {
    // On retourne l'objet avec le thème qui a la note la plus basse, car c'est là où le salarié va le moins bien.
    return val[valueName] < acc[valueName] ? val : acc;
  });
  return maxMarkObject[groupName];
}

module.exports = { defineProfile };
