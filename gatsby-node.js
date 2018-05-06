const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.tsx')
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
              filter: { fileAbsolutePath: { glob: "**/blog/*" } }
            ) {
              edges {
                node {
                  fields {
                    slug
                  }
                  excerpt(pruneLength: 280)
                  frontmatter {
                    title
                    date
                    author {
                      name
                      twitter
                      github
                      avatar_url
                    }
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges

        _.each(posts, (post, index) => {
          const previous =
            index === posts.length - 1 ? null : posts[index + 1].node
          const next = index === 0 ? null : posts[index - 1].node

          createPage({
            path: post.node.fields.slug,
            component: blogPost,
            context: {
              slug: post.node.fields.slug,
              previous,
              next,
            },
          })
        })
      })
    )
  })
}

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators

  if (
    node.internal.type === `MarkdownRemark` &&
    node.fileAbsolutePath.includes('/blog/')
  ) {
    const relativeFilePath = createFilePath({
      node,
      getNode,
      basePath: 'blog/',
    })
    createNodeField({
      name: `slug`,
      node,
      value: `/blog${relativeFilePath}`,
    })
  }
}
