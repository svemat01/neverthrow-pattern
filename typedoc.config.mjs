/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
    entryPoints: ["src/index.ts"],
    name: "neverthrow-pattern",

    plugin: ["typedoc-material-theme"],

    navigation: {
        excludeReferences: true,
    },
    searchInComments: true,
    searchInDocuments: true,
};

export default config;