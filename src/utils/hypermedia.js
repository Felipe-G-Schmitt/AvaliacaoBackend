const generateUserLinks = (user) => ({
  ...user,
  links: [
    { rel: "self", method: "GET", href: `/users/${user.id}` },
    { rel: "update", method: "PUT", href: `/users/${user.id}` },
    { rel: "all", method: "GET", href: `/users` }
  ]
});

const generateProductLinks = (product) => ({
  ...product,
  links: [
    { rel: "self", method: "GET", href: `/products/${product.id}` },
    { rel: "update", method: "PUT", href: `/products/${product.id}` },
    { rel: "all", method: "GET", href: `/products` }
  ]
});

const generateCategoryLinks = (category) => ({
  ...category,
  links: [
    { rel: "self", method: "GET", href: `/categories/${category.id}` },
    { rel: "update", method: "PUT", href: `/categories/${category.id}` },
    { rel: "all", method: "GET", href: `/categories` }
  ]
});

const generateOrderLinks = (order) => ({
  ...order,
  links: [
    { rel: "self", method: "GET", href: `/orders/${order.id}` },
    { rel: "update", method: "PUT", href: `/orders/${order.id}` },
    { rel: "all", method: "GET", href: `/orders` }
  ]
});

module.exports = {
  generateUserLinks,
  generateProductLinks,
  generateCategoryLinks,
  generateOrderLinks
};
