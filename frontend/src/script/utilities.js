const utilities = {
  confirmDeletion(event, form) {
    event.preventDefault();
    const decision = confirm('Confirmar exclusão?');
    if (decision) form.submit();
  },
};
