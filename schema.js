const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

let url = '';

const PublisherType = new GraphQLObjectType({
  name: 'Publisher',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(publisher) {
        return axios.get(url + '/publishers/' + publisher.id + '/books')
          .then(res => res.data);
      }
    }
  })
})

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    isbn: {
      type: GraphQLString
    },
    language: {
      type: GraphQLString
    },
    pages: {
      type: GraphQLInt
    },
    summary: {
      type: GraphQLString
    },
    title: {
      type: GraphQLString
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(book) {
        return axios.get(url + '/books/' + book.id + '/authors')
          .then(res => res.data);
      }
    },
    publisher: {
      type: new GraphQLList(AuthorType),
      resolve(book) {
        return axios.get(url + '/books/' + book.id + '/authors')
          .then(res => res.data);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    firstName: {
      type: GraphQLString
    },
    lastName: {
      type: GraphQLString
    },
    books: {
      type: new GraphQLList(AuthorType),
      resolve(author) {
        return axios.get(url + '/authors/' + author.id + '/books')
          .then(res => res.data);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    author: {
      type: AuthorType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        return axios.get(url + '/authors/' + args.id)
          .then(res => res.data);
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parentValue, args) {
        return axios.get(url + '/authors/')
          .then(res => res.data);
      }
    },
    book: {
      type: BookType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        return axios.get(url + '/books/' + args.id)
          .then(res => res.data);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parentValue, args) {
        return axios.get(url + '/books/')
          .then(res => res.data);
      }
    },
    publisher: {
      type: PublisherType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        return axios.get(url + '/publishers/' + args.id)
          .then(res => res.data);
      }
    },
    publishers: {
      type: new GraphQLList(PublisherType),
      resolve(parentValue, args) {
        return axios.get(url + '/publishers/')
          .then(res => res.data)
      }
    },
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        firstName: {
          type: new GraphQLNonNull(GraphQLString)
        },
        lastName: {
          type: new GraphQLNonNull(GraphQLString)
        },
      },
      resolve(parentValue, args) {
        return axios.post(url + '/authors/', {
          firstName: args.firstName,
          lastName: args.lastName,
        }).then(res => res.data);
      }
    }
  }
});

module.exports = (baseUrl) => {
  url = baseUrl;
  return new GraphQLSchema({
    query: RootQuery,
    mutation
  });
}