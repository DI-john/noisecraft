import { Eventable } from './eventable.js';

/**
Create a modal dialog popup showing content wrapped in a div
*/
export class Dialog extends Eventable
{
    constructor(title, div)
    {
        super();

        function bgClick(evt)
        {
            this.close();
            evt.stopPropagation();
        }

        this.div = document.createElement('div');
        this.div.className = 'dialog';

        // Form title
        let titleDiv = document.createElement('div');
        titleDiv.className = 'dialog_title';
        titleDiv.appendChild(document.createTextNode(title));
        this.div.appendChild(titleDiv);

        // Form contents
        this.div.appendChild(div);

        // Form validation error message (hidden by default)
        this.errorDiv = document.createElement('div');
        this.errorDiv.className = 'form_error';
        this.div.appendChild(this.errorDiv);

        // Used to detect/prevent clicks outside dialog
        this.bgDiv = document.createElement('div');
        this.bgDiv.className = 'dark_overlay';
        this.bgDiv.onclick = bgClick.bind(this);

        // Add the form to the document
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(this.div);
        body.appendChild(this.bgDiv);

        function keyHandler(evt)
        {
            this.trigger('keydown', evt.key);

            // Close the dialog when the escape key is pressed
            if (evt.key === "Escape")
                this.close();
        }

        this.keyHandler = keyHandler.bind(this);
        body.addEventListener('keydown', this.keyHandler);
    }

    // TODO: method to create a named button with the right styling

    /**
     * Show an error message (e.g. for form validation)
     */
    showError(msg)
    {
        this.errorDiv.textContent = msg;
        this.errorDiv.style.display = 'block';
    }

    /**
     * Hide the form error message
     */
    hideError()
    {
        this.errorDiv.style.display = 'none';
    }

    /**
     * Close the dialog window
     */
    close()
    {
        var body = document.getElementsByTagName("body")[0];

        if (!body.contains(this.div))
            return;

        body.removeChild(this.div);
        body.removeChild(this.bgDiv);
        body.removeEventListener('keydown', this.keyHandler);

        this.trigger('close');
    }
}
