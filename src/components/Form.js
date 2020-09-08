import React from "react";

export const Form = (props) => {
    return (
        <form className="col s12">
            <div className="row">
                <div className="input-field col s6">
                    <i className="material-icons prefix">mode_edit</i>
                    <textarea
                        id="icon_prefix2"
                        className="materialize-textarea"
                        onChange={(e) => props.onChangeHandler(e)}
                        disabled={props.start}
                        value={props.text}
                    ></textarea>
                    <label htmlFor="icon_prefix2">Список страниц</label>
                </div>
            </div>
        </form>
    );
};