/* @flow */
import { branchOnClient } from 'rumor-mill/clients'

export default branchOnClient({
  mysql() {
    return 'mysql'
  },
  postgresql() {
    return 'postgresql'
  },
  sqlite() {
    return 'sqlite'
  }
})
