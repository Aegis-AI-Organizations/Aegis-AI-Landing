import type { Block } from "payload";
import {
  lexicalEditor,
  FixedToolbarFeature,
  BlocksFeature,
  UploadFeature,
  HeadingFeature,
} from "@payloadcms/richtext-lexical";

const blocks: Block[] = [
  {
    slug: "callout",
    labels: { singular: "Encadré", plural: "Encadrés" },
    fields: [
      {
        name: "tone",
        label: "Style",
        type: "select",
        defaultValue: "info",
        options: [
          { label: "À retenir", value: "info" },
          { label: "Conseil", value: "tip" },
          { label: "Attention", value: "warning" },
        ],
      },
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "body", label: "Texte", type: "textarea", required: true },
    ],
  },
  {
    slug: "codeSnippet",
    labels: { singular: "Bloc de code", plural: "Blocs de code" },
    fields: [
      { name: "filename", label: "Fichier ou légende", type: "text" },
      { name: "code", label: "Code", type: "code", required: true },
    ],
  },
  {
    slug: "articleTable",
    labels: { singular: "Tableau", plural: "Tableaux" },
    fields: [
      {
        name: "caption",
        label: "Titre du tableau",
        type: "text",
        required: true,
      },
      {
        name: "headers",
        label: "Colonnes",
        type: "array",
        minRows: 2,
        maxRows: 6,
        required: true,
        fields: [
          { name: "text", label: "En-tête", type: "text", required: true },
        ],
      },
      {
        name: "rows",
        label: "Lignes",
        type: "array",
        required: true,
        minRows: 1,
        fields: [
          {
            name: "cells",
            label: "Cellules (dans l’ordre des colonnes)",
            type: "array",
            minRows: 1,
            maxRows: 6,
            fields: [{ name: "text", label: "Texte", type: "textarea" }],
          },
        ],
      },
    ],
  },
  {
    slug: "articleFAQ",
    labels: {
      singular: "Questions / réponses",
      plural: "Questions / réponses",
    },
    fields: [
      {
        name: "items",
        label: "Questions",
        type: "array",
        required: true,
        minRows: 1,
        fields: [
          { name: "question", label: "Question", type: "text", required: true },
          {
            name: "answer",
            label: "Réponse",
            type: "textarea",
            required: true,
          },
        ],
      },
    ],
  },
];

export const articleEditor = lexicalEditor({
  admin: {
    placeholder:
      "Commencez votre article… Tapez / pour insérer une image, une citation ou un bloc.",
  },
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter(
      ({ key }) => !["heading", "upload", "relationship"].includes(key),
    ),
    HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
    FixedToolbarFeature(),
    UploadFeature({
      enabledCollections: ["media"],
      collections: {
        media: {
          fields: [{ name: "caption", label: "Légende", type: "text" }],
        },
      },
    }),
    BlocksFeature({ blocks }),
  ],
});
