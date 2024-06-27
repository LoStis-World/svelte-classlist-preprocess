export const classListPreprocessor = pattern => {
	return {
		name: 'classArrayPreprocessor',
		markup: ({ content, filename }) => {
			filename = filename ?? '';
			// Check for class:list={[]} pattern
			const classArrayPattern = new RegExp(
				`class:${pattern ?? 'list'}={\\[(.*?)\\]}`,
				'g'
			);

			// If no class:list pattern is found or if filename is not .svelte, return the content as is
			if (!content.match(classArrayPattern) || !filename.endsWith('.svelte')) {
				return {
					code: content,
					map: undefined,
				};
			}
			// Transform class array to string and remove the custom class:list attribute
			const transformedContent = content.replace(
				classArrayPattern,
				(_, classArray) => {
					// Split the class array by commas
					const classes = classArray.split(',').map(cls => cls.trim());

					// Filter only the static string classes and remove quotes
					const staticClasses = classes
						.filter(cls => /^["'].*["']$/.test(cls))
						.map(cls => cls.replace(/^["']|["']$/g, ''))
						.join(' ');

					// Filter only the dynamic classes
					const dynamicClasses = classes.filter(
						cls => !/^["'].*["']$/.test(cls)
					);

					// Construct the final class attribute
					if (staticClasses && dynamicClasses.length > 0) {
						return `class="${staticClasses} ${dynamicClasses
							.map(cls => `{${cls}}`)
							.join(' ')
							.split(' ')
							.filter(cls => cls.trim())
							.join(' ')}"`;
					} else if (staticClasses) {
						return `class="${staticClasses}"`;
					} else {
						return `class="${dynamicClasses
							.map(cls => `{${cls}}`)
							.join(' ')
							.split(' ')
							.filter(cls => cls.trim())
							.join(' ')}"`;
					}
				}
			);

			return {
				code: transformedContent,
				map: undefined,
			};
		},
	};
};
