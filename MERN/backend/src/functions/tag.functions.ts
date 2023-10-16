// Adds a backtick between tags as a separater to simplify storing/searching tags in MySQL.
const concatTags = function (tags: string[]): string {
    let cTags: string = "";
    for (let i = 0; i < tags.length - 1; ++i) {
        cTags = cTags + tags.at(i) + '`';
    }
    cTags = cTags + tags.at(tags.length - 1);

    return cTags;
}

export { concatTags };