import { Embeddings } from "@langchain/core/embeddings";
import { Tool } from "@langchain/core/tools";
import { getEncoding } from "@langchain/core/utils/tiktoken";
import { Serializable } from "@langchain/core/load/serializable";
import { compare } from "@langchain/core/utils/json_patch";

export const doNotRemove = Embeddings;
export const doNotRemove2 = Tool;
export const doNotRemove3 = getEncoding;
export const doNotRemove4 = Serializable;
export const doNotRemove5 = compare;
