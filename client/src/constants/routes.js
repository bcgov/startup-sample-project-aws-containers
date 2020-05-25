export default Object.freeze({

  // Public routes
  Form: '/',
  Login: '/login',
  Confirmation: '/confirmation',
  RenderPDF: {
    staticRoute: '/renderpdf/:id/:jwt',
    dynamicRoute: (id, jwt) => `/renderpdf/${id}/${jwt}`,
  },

  // Private routes
  Lookup: '/lookup',
  LookupLastName: {
    staticRoute: '/lookup-last-name/:lastName',
    dynamicRoute: (lastName) => `/lookup-last-name/${lastName}`,
  },
  LookupConfirmationNumber: {
    staticRoute: '/lookup-confirmation-number/:confirmationNumber',
    dynamicRoute: (confirmationNumber) => `/lookup-confirmation-number/${confirmationNumber}`,
  },
});
