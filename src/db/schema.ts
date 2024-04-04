import {
  pgTable,
  timestamp,
  text,
  integer,
  uniqueIndex,
  index,
  boolean,
  jsonb,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  Candidate,
  CorrectCandidate,
  ExamResultCandidate,
} from "@/types/problems";

export const problemSet = pgTable(
  "ProblemSet",
  {
    uuid: uuid("uuid")
      .primaryKey()
      .notNull()
      .default(sql`uuid_generate_v4()`),
    name: text("name").notNull(),
    userUuid: uuid("userUuid")
      .notNull()
      .references(() => user.uuid, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    description: text("description"),
    timeLimit: integer("timeLimit"),
    createdAt: timestamp("createdAt", {
      precision: 0,
      mode: "date",
      withTimezone: true,
    })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 0,
      mode: "date",
      withTimezone: true,
    }).notNull(),
    isPublic: boolean("isPublic").default(false).notNull(),
  },
  (table) => {
    return {
      uuidKey: uniqueIndex("ProblemSet_uuid_key").on(table.uuid),
    };
  },
);

export const problemSetRelation = relations(problemSet, ({ many, one }) => ({
  likedProblemSets: many(likedProblemSets),
  problems: many(problem),
  comments: many(problemSetComment),
  user: one(user, {
    fields: [problemSet.userUuid],
    references: [user.uuid],
  }),
}));

export const problem = pgTable(
  "Problem",
  {
    uuid: uuid("uuid")
      .primaryKey()
      .notNull()
      .default(sql`uuid_generate_v4()`),
    order: integer("order").notNull(),
    question: text("question").notNull(),
    questionType: text("questionType").notNull(),
    imageUuid: uuid("imageUuid").references(() => image.uuid, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    candidates: jsonb("candidates").$type<Candidate[]>(),
    additionalView: text("additionalView"),
    problemSetUuid: uuid("problemSetUuid")
      .notNull()
      .references(() => problemSet.uuid, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    subjectiveAnswer: text("subjectiveAnswer"),
    userUuid: uuid("userUuid")
      .notNull()
      .references(() => user.uuid, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    isAnswerMultiple: boolean("isAnswerMultiple").default(false).notNull(),
  },
  (table) => {
    return {
      uuidKey: uniqueIndex("Problem_uuid_key").on(table.uuid),
    };
  },
);

export const problemRelation = relations(problem, ({ one, many }) => ({
  problemSet: one(problemSet, {
    fields: [problem.problemSetUuid],
    references: [problemSet.uuid],
  }),
  image: one(image, {
    fields: [problem.imageUuid],
    references: [image.uuid],
  }),
  user: one(user, {
    fields: [problem.userUuid],
    references: [user.uuid],
  }),
}));

export const user = pgTable(
  "User",
  {
    uuid: uuid("uuid")
      .primaryKey()
      .notNull()
      .default(sql`uuid_generate_v4()`),
    name: text("name").notNull(),
    email: text("email").notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt", {
      precision: 0,
      mode: "date",
      withTimezone: true,
    })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 0,
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (table) => {
    return {
      uuidKey: uniqueIndex("User_uuid_key").on(table.uuid),
      emailKey: uniqueIndex("User_email_key").on(table.email),
    };
  },
);

export const userRelation = relations(user, ({ many }) => ({
  likedProblemSets: many(likedProblemSets),
  problemSetComments: many(problemSetComment),
  images: many(imageToUser),
  problems: many(problem),
  problemSets: many(problemSet),
  results: many(result),
  problemResults: many(problemResult),
}));

export const likedProblemSets = pgTable(
  "_LikedProblemSets",
  {
    problemSetUuid: uuid("problemSetUuid")
      .notNull()
      .references(() => problemSet.uuid, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userUuid: uuid("userUuid")
      .notNull()
      .references(() => user.uuid, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("createdAt", {
      precision: 0,
      mode: "date",
      withTimezone: true,
    })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.problemSetUuid, t.userUuid] }),
  }),
);

export const likedProblemSetsRelation = relations(
  likedProblemSets,
  ({ one }) => ({
    problemSet: one(problemSet, {
      fields: [likedProblemSets.problemSetUuid],
      references: [problemSet.uuid],
    }),
    user: one(user, {
      fields: [likedProblemSets.userUuid],
      references: [user.uuid],
    }),
  }),
);

export const image = pgTable(
  "Image",
  {
    uuid: uuid("uuid")
      .primaryKey()
      .notNull()
      .default(sql`uuid_generate_v4()`),
    filename: text("filename").notNull(),
    key: text("key").notNull(),
    url: text("url").notNull(),
    hash: text("hash").notNull(),
  },
  (table) => {
    return {
      uuidKey: uniqueIndex("Image_uuid_key").on(table.uuid),
      keyKey: uniqueIndex("Image_key_key").on(table.key),
      urlKey: uniqueIndex("Image_url_key").on(table.url),
      hashKey: uniqueIndex("Image_hash_key").on(table.hash),
    };
  },
);

export const imageRelation = relations(image, ({ many, one }) => ({
  users: many(imageToUser),
  problems: many(problem),
  problemResults: many(problemResult),
}));

export const result = pgTable(
  "Result",
  {
    uuid: uuid("uuid")
      .primaryKey()
      .notNull()
      .default(sql`uuid_generate_v4()`),
    userUuid: uuid("userUuid")
      .notNull()
      .references(() => user.uuid, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    problemSetName: text("problemSetName").notNull(),
    createdAt: timestamp("createdAt", {
      precision: 0,
      mode: "date",
      withTimezone: true,
    })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 0,
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (table) => {
    return {
      uuidKey: uniqueIndex("Result_uuid_key").on(table.uuid),
    };
  },
);

export const resultRelation = relations(result, ({ many, one }) => ({
  problemResults: many(problemResult),
  user: one(user, {
    fields: [result.userUuid],
    references: [user.uuid],
  }),
}));

export const problemResult = pgTable(
  "ProblemResult",
  {
    uuid: uuid("uuid")
      .primaryKey()
      .notNull()
      .default(sql`uuid_generate_v4()`),
    order: integer("order").notNull(),
    question: text("question").notNull(),
    questionType: text("questionType").notNull(),
    additionalView: text("additionalView"),
    resultUuid: uuid("resultUuid")
      .notNull()
      .references(() => result.uuid, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    isCorrect: boolean("isCorrect").notNull(),
    candidates: jsonb("candidates").$type<ExamResultCandidate[]>(),
    isAnswerMultiple: boolean("isAnswerMultiple").notNull(),
    userUuId: uuid("userUuId")
      .notNull()
      .references(() => user.uuid, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    imageUuid: uuid("imageUuid").references(() => image.uuid, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    subjectiveAnswered: text("subjectiveAnswered"),
    correctSubjectiveAnswer: text("correctSubjectiveAnswer"),
    correctCandidates: jsonb("correctCandidates").$type<CorrectCandidate[]>(),
    createdAt: timestamp("createdAt", {
      precision: 0,
      mode: "date",
      withTimezone: true,
    })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 0,
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (table) => {
    return {
      uuidKey: uniqueIndex("ProblemResult_uuid_key").on(table.uuid),
    };
  },
);

export const problemResultRelation = relations(problemResult, ({ one }) => ({
  result: one(result, {
    fields: [problemResult.resultUuid],
    references: [result.uuid],
  }),
  image: one(image, {
    fields: [problemResult.imageUuid],
    references: [image.uuid],
  }),
  user: one(user, {
    fields: [problemResult.userUuId],
    references: [user.uuid],
  }),
}));

export const imageToUser = pgTable(
  "_ImageToUser",
  {
    imageUuid: uuid("imageUuid")
      .notNull()
      .references(() => image.uuid, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userUuid: uuid("userUuid")
      .notNull()
      .references(() => user.uuid, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.imageUuid, t.userUuid] }),
  }),
);

export const imageToUserRelation = relations(imageToUser, ({ one }) => ({
  images: one(image, {
    fields: [imageToUser.imageUuid],
    references: [image.uuid],
  }),
  user: one(user, {
    fields: [imageToUser.userUuid],
    references: [user.uuid],
  }),
}));

export const problemSetComment = pgTable(
  "problemSetComment",
  {
    uuid: uuid("uuid")
      .primaryKey()
      .notNull()
      .default(sql`uuid_generate_v4()`),
    userUuid: uuid("userUuid")
      .notNull()
      .references(() => user.uuid, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    problemSetUuid: uuid("problemSetUuid")
      .notNull()
      .references(() => problemSet.uuid, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    content: text("content").notNull(),
    createdAt: timestamp("createdAt", {
      precision: 0,
      mode: "date",
      withTimezone: true,
    })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 0,
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (table) => {
    return {
      uuidKey: uniqueIndex("Comment_uuid_key").on(table.uuid),
    };
  },
);

export const problemSetCommentRelation = relations(
  problemSetComment,
  ({ one }) => ({
    user: one(user, {
      fields: [problemSetComment.userUuid],
      references: [user.uuid],
    }),
    problemSet: one(problemSet, {
      fields: [problemSetComment.problemSetUuid],
      references: [problemSet.uuid],
    }),
  }),
);
