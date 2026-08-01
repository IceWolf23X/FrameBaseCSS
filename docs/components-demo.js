const dialogTriggers = new WeakMap();

/** Restores focus to the control that opened a dialog. */
function restoreDialogTriggerFocus(event) {
  dialogTriggers.get(event.currentTarget)?.focus();
}

/** Opens the dialog referenced by a documentation trigger. */
function openTargetDialog(event) {
  const trigger = event.currentTarget;
  const dialog = document.getElementById(trigger.dataset.dialogTarget);

  if (dialog instanceof HTMLDialogElement && !dialog.open) {
    dialogTriggers.set(dialog, trigger);
    dialog.addEventListener("close", restoreDialogTriggerFocus, { once: true });
    dialog.showModal();
  }
}

for (const trigger of document.querySelectorAll("[data-dialog-target]")) {
  trigger.addEventListener("click", openTargetDialog);
}
