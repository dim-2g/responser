import React from "react";
import {download} from "../utils/functions";

export const Controls = (props) => {
    return (
        <div className="responser-controls">
            <button
                className="waves-effect waves-light btn"
                onClick={props.onRun}
                disabled={props.start}
            >
                <i className="material-icons left">play_arrow</i>
                Начать проверку
            </button>
            {props.finish &&
                <>
                    <button
                        className="waves-effect waves-light btn red lighten-2"
                        onClick={props.onReinit}
                    >
                        <i className="material-icons left">autorenew</i>
                        Новая проверка
                    </button>
                    <button
                        className="waves-effect waves-light btn green darken-1"
                        onClick={() => props.onDownload(props.pages)}
                    >
                        <i className="material-icons left">arrow_downward</i>
                        Скачать в xls
                    </button>
                </>
            }
        </div>
    );
}