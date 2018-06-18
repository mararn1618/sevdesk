import { expect, tap } from 'tapbundle'
import * as sevdesk from '../ts/index'

tap.test('first test', async () => {
  console.log(sevdesk.standardExport)
})

tap.start()
