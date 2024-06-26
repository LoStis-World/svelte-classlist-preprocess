export const classListPreprocessor = () => {
    return {
      name: 'classArrayPreprocessor',
      markup: ({ content, filename }) => {
        filename = filename ?? ''
        // Check for class:list={[]} pattern
        const classArrayPattern = /class:list={\[(.*?)\]}/g
  
        // If no class:list pattern is found or if filename is not .svelte, return the content as is
        if (!content.match(classArrayPattern) || !filename.endsWith('.svelte')) {
          return {
            code: content,
            map: undefined,
          }
        }
        // Transform class array to string and remove the custom class:list attribute
        const transformedContent = content.replace(classArrayPattern, (_, classArray) => {
          const classes = classArray
            .split(',')
            .map(cls => cls.trim().replace(/^["']|["']$/g, ''))
            .filter(cls => cls !== '') // Filter out empty strings
            .join(' ')
  
          // Return class attribute if classes array is not empty, otherwise return an empty string
          return classes !== '' ? `class="${classes}"` : ''
        })
  
        return {
          code: transformedContent,
          map: undefined,
        }
      },
    }
  }  
