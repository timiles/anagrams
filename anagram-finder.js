/* prototype extensions */
String.prototype.removeCharAt = function (i) {
    if (i < 0 || i > this.length) {
        throw 'Index out of range: ' + i + '. Length of string: ' + this.length;
    }
    return this.slice(0, i) + this.slice(i + 1);
}
String.prototype.toAnagramKey = function () {
    // return characters in alphabetical order
    return this.split('').sort().join('');
}

Array.prototype.distinct = function () {
    var a = [];
    for (var i = 0, l = this.length; i < l; i++)
        if (a.indexOf(this[i]) === -1)
            a.push(this[i]);
    return a;
}

var AnagramFinder = function (words) {

    var alphabet = 'abcdefghijklmnopqrstuvwxyz';
    var anagramDictionary = createAnagramDictionary(words);

    function createAnagramDictionary(words) {
        var dictionary = new Map();
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            var key = word.toAnagramKey();
            if (!dictionary.has(key)) {
                dictionary.set(key, [word]);
            }
            else {
                dictionary.get(key).push(word);
            }
        }
        return dictionary;
    }

    this.findAnagrams = function (letters, numberOfExtraLetters = 0) {

        if (numberOfExtraLetters == 0) {
            var key = letters.toAnagramKey();
            return anagramDictionary.get(key);
        }

        var allAnagrams = [];
        for (var i = 0; i < alphabet.length; i++) {
            var letter = alphabet.charAt(i);
            var newLetters = letters + letter;
            var anagrams = this.findAnagrams(newLetters, numberOfExtraLetters - 1);
            if (anagrams) {
                allAnagrams = allAnagrams.concat(anagrams);
            }
        }
        return allAnagrams.distinct().sort();
    }

    function getAllSubsetsOfLetters(letters) {
        var key = letters.toAnagramKey();
        var subsets = [];
        // e.g. key.length = 4: 1111, 1110, 1101, 1100, ... 11, 10, 1.
        for (var i = Math.pow(2, key.length) - 1; i >= 1; i--) {
            var set = '';
            var binaryString = i.toString(2);
            // pad out left, so if key.length = 4, we treat 10 as 0010
            var paddingOffset = key.length - binaryString.length;
            for (var j = 0; j < key.length; j++) {
                if (binaryString[j] === '1') {
                    set += key[j + paddingOffset];
                }
            }
            subsets.push(set);
        }
        // distinct because duplicate letters will create sets
        return subsets.distinct();
    }

    this.findLongestWords = function (letters, maxNumberOfExtraLetters = 1) {
        var subsetsOfLetters = getAllSubsetsOfLetters(letters);
        var currentLengthToTest = letters.length;
        var words = [];
        while (words.length === 0 && currentLengthToTest > 0) {
            for (var i = 0; i < subsetsOfLetters.length; i++) {
                if (subsetsOfLetters[i].length === currentLengthToTest) {
                    for (var numberOfExtraLetters = maxNumberOfExtraLetters; numberOfExtraLetters >= 0; numberOfExtraLetters--) {
                        var anagrams = this.findAnagrams(subsetsOfLetters[i], numberOfExtraLetters);
                        if (anagrams) {
                            words = words.concat(anagrams);
                        }
                    }
                }
            }
            currentLengthToTest--;
        }
        return words.distinct();
    }
}