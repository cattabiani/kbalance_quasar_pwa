const Result = {
  make(nPeople = 0) {
    const mat = [];
    let nzeros = 0;
    const ans = { mat, nzeros };

    for (let i = 0; i < nPeople; ++i) {
      this.addPerson(ans);
    }
    return ans;
  },

  addPerson(result) {
    result.nzeros += result.mat.length;
    result.mat.push(Array(result.mat.length).fill(0));
  },

  getSummary(result, id) {
    if (id === null || id === undefined || id < 0 || id >= result.mat.length) {
      return [];
    }

    const ans = [];

    // Add the values from the row at 'id' with 0 appended
    for (let i = 0; i < result.mat[id].length; i++) {
      if (result.mat[id][i] !== 0) {
        ans.push({ person: i, amount: result.mat[id][i] });
      }
    }

    // Add the negative values of the column at 'id' from the lower triangle
    for (let i = id + 1; i < result.mat.length; i++) {
      if (result.mat[i][id] !== 0) {
        ans.push({ person: i, amount: -result.mat[i][id] });
      }
    }

    // Filter out zero values
    return ans;
  },

  isEmpty(result) {
    if (result.mat.length === 0) {
      return true;
    }
    return result.nzeros === (result.mat.length * (result.mat.length - 1)) / 2;
  },

  isPersonRemovable(result, id) {
    if (!result.mat[id].every((element) => element === 0)) {
      return false;
    }

    // Step 2: Check if all elements in column i are 0 (in rows after i)
    for (let row = id + 1; row < result.mat.length; ++row) {
      if (result.mat[row][id] !== 0) {
        return false;
      }
    }
    return true;
  },

  removePerson(result, id, safe = true) {
    if (safe && !this.isPersonRemovable(result, id)) {
      return false;
    }

    result.nzeros -= max(result.mat.length - 1, 0);

    // Step 3: Remove row i
    result.mat.splice(id, 1);

    // Step 4: Remove column i from each row after row i
    for (let row = id; row < result.mat.length; row++) {
      result.mat[row].splice(id, 1);
    }

    return true;
  },

  addTransaction(result, transaction, multi) {
    const j = transaction.payer;
    for (let i = 0; i < transaction.owed.length; ++i) {
      this.add(result, i, j, multi * transaction.owed[i]);
    }
  },

  add(result, i, j, v) {
    if (i === j) {
      return;
    }

    if (i < j) {
      [i, j] = [j, i];
      v = -v;
    }

    const oldv = result.mat[i][j];
    result.mat[i][j] += v;
    const newv = result.mat[i][j];

    if (oldv !== 0 && newv === 0) {
      ++result.nzeros;
    }
    if (oldv === 0 && newv !== 0) {
      --result.nzeros;
    }
  },
};

export default Result;
