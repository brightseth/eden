// ESLint rule to prevent public storage URLs
module.exports = {
  rules: {
    'no-public-storage-urls': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow public storage URLs - use Registry signed URLs instead',
          category: 'Security',
          recommended: true
        },
        messages: {
          noPublicStorage: 'Public storage URLs are forbidden. Use Registry API for signed URLs.',
          noDirectSupabase: 'Direct Supabase access is forbidden. Use Registry API.'
        }
      },
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === 'string') {
              // Check for public storage URLs
              if (node.value.includes('storage/v1/object/public')) {
                context.report({
                  node,
                  messageId: 'noPublicStorage'
                });
              }
              
              // Check for direct Supabase URLs
              if (node.value.includes('ctlygyrkibupejllgglr.supabase.co')) {
                context.report({
                  node,
                  messageId: 'noDirectSupabase'
                });
              }
            }
          },
          TemplateElement(node) {
            const value = node.value.raw;
            if (value.includes('storage/v1/object/public')) {
              context.report({
                node,
                messageId: 'noPublicStorage'
              });
            }
            if (value.includes('ctlygyrkibupejllgglr.supabase.co')) {
              context.report({
                node,
                messageId: 'noDirectSupabase'
              });
            }
          }
        };
      }
    }
  }
};