import { MessagePlugin, MessageComponent, MessagePluginOptions, MessageMatcher, MessagePluginFactory } from "../common/interfaces/message-plugin";
import { InputPlugin, InputComponent, InputPluginOptions, InputRule, InputPluginFactory } from "../common/interfaces/input-plugin";
import { IMessage } from "../common/interfaces/message";

const createStringMatcher = (name: string): MessageMatcher => message => message.data
    && message.data._plugin
    && message.data._plugin.type === name;

type MessagePluginCreator = (match: MessageMatcher | string, component: MessageComponent, options?: Partial<MessagePluginOptions>) => MessagePlugin;
export const createMessagePlugin: MessagePluginCreator = (match, component, options = {}): MessagePlugin => {
    if (typeof match === 'string')
        match = createStringMatcher(match);

    const plugin: MessagePlugin = {
        match,
        component,
        options
    }

    return plugin;
};

export const registerMessagePlugin = (plugin: MessagePlugin | MessagePluginFactory) => {
    if (window) {
        // @ts-ignore
        window.cognigyWebchatMessagePlugins = [...(window.cognigyWebchatMessagePlugins || []), plugin];
    }
}




// type InputPluginCreator = (match: InputRule | string, component: InputComponent, options?: Partial<InputPluginOptions>) => InputPlugin;
// export const createInputPlugin: InputPluginCreator = (match, component, options = {}) => {
//     const plugin = {
//         match,
//         component,
//         options
//     }

//     return plugin;
// };

export const registerInputPlugin = (plugin: InputPlugin | InputPluginFactory) => {
    if (window) {
        // @ts-ignore
        window.cognigyWebchatInputPlugins = [...(window.cognigyWebchatInputPlugins || []), plugin];
    }
}

export const getPluginsForMessage = (plugins: MessagePlugin[]) => (message: IMessage): MessagePlugin[] => {
    let matchedPlugins: MessagePlugin[] = [];

    for (const plugin of plugins) {
        const isMatch = (plugin.match as MessageMatcher)(message);

        if (isMatch) {
            matchedPlugins.push(plugin);

            if (!plugin.options || !plugin.options.passthrough)
                break;
        }
    }

    return matchedPlugins;
}

export const isFullscreenPlugin = (plugin: MessagePlugin) => plugin.options && plugin.options.fullscreen;