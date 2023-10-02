import type { ClientSession, ConnectOptions, Connection } from 'mongoose'
import type { Payload } from 'payload'
import type { DatabaseAdapter } from 'payload/database'

import mongoose from 'mongoose'
import { createDatabaseAdapter } from 'payload/database'
import { createMigration } from 'payload/database'

export type { MigrateDownArgs, MigrateUpArgs } from './types'

import type { CollectionModel, GlobalModel } from './types'

import { connect } from './connect'
import { create } from './create'
import { createGlobal } from './createGlobal'
import { createGlobalVersion } from './createGlobalVersion'
import { createVersion } from './createVersion'
import { deleteMany } from './deleteMany'
import { deleteOne } from './deleteOne'
import { deleteVersions } from './deleteVersions'
import { destroy } from './destroy'
import { find } from './find'
import { findGlobal } from './findGlobal'
import { findGlobalVersions } from './findGlobalVersions'
import { findOne } from './findOne'
import { findVersions } from './findVersions'
import { init } from './init'
import { queryDrafts } from './queryDrafts'
import { beginTransaction } from './transactions/beginTransaction'
import { commitTransaction } from './transactions/commitTransaction'
import { rollbackTransaction } from './transactions/rollbackTransaction'
import { updateGlobal } from './updateGlobal'
import { updateGlobalVersion } from './updateGlobalVersion'
import { updateOne } from './updateOne'
import { updateVersion } from './updateVersion'
import { webpack } from './webpack'

export interface Args {
  /** Set to false to disable auto-pluralization of collection names, Defaults to true */
  autoPluralization?: boolean
  /** Extra configuration options */
  connectOptions?: ConnectOptions & {
    /** Set false to disable $facet aggregation in non-supporting databases, Defaults to true */
    useFacet?: boolean
  }
  migrationDir?: string
  /** The URL to connect to MongoDB or false to start payload and prevent connecting */
  url: false | string
}

export type MongooseAdapter = DatabaseAdapter &
  Args & {
    collections: {
      [slug: string]: CollectionModel
    }
    connection: Connection
    globals: GlobalModel
    mongoMemoryServer: any
    sessions: Record<number | string, ClientSession>
    versions: {
      [slug: string]: CollectionModel
    }
  }

type MongooseAdapterResult = (args: { payload: Payload }) => MongooseAdapter

export function mongooseAdapter({
  autoPluralization = true,
  connectOptions,
  migrationDir,
  url,
}: Args): MongooseAdapterResult {
  function adapter({ payload }: { payload: Payload }) {
    mongoose.set('strictQuery', false)

    return createDatabaseAdapter<MongooseAdapter>({
      autoPluralization,
      beginTransaction,
      collections: {},
      commitTransaction,
      connect,
      connectOptions: connectOptions || {},
      connection: undefined,
      create,
      createGlobal,
      createGlobalVersion,
      createMigration,
      createVersion,
      defaultIDType: 'text',
      deleteMany,
      deleteOne,
      deleteVersions,
      destroy,
      find,
      findGlobal,
      findGlobalVersions,
      findOne,
      findVersions,
      globals: undefined,
      init,
      ...(migrationDir && { migrationDir }),
      name: 'mongoose',
      mongoMemoryServer: undefined,
      payload,
      queryDrafts,
      rollbackTransaction,
      sessions: {},
      updateGlobal,
      updateGlobalVersion,
      updateOne,
      updateVersion,
      url,
      versions: {},
      webpack,
    })
  }

  return adapter
}
