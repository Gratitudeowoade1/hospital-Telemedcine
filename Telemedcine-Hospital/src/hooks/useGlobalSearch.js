import { useMemo } from 'react'
import searchRegistry from '../data/searchRegistry'

const useGlobalSearch = (query) => {
  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return searchRegistry.filter(
      ({ label, keywords }) =>
        label.toLowerCase().includes(q) ||
        keywords.some(k => k.toLowerCase().includes(q))
    )
  }, [query])

  return results
}

export default useGlobalSearch
