import { colors } from "@/src/styles/theme";
import { Feather } from "@expo/vector-icons";
import { ComponentProps } from "react";
import {
    ActivityIndicator,
    Text,
    TextProps,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";
import { s } from "./styles";

type ButtonProps = TouchableOpacityProps & {
    isLoading?: boolean;
};

function Button({ children, style, isLoading = false, ...rest }: ButtonProps) {
    return (
        <TouchableOpacity
            style={[s.container, style]}
            disabled={isLoading}
            {...rest}
        >
            {isLoading ? (
                <ActivityIndicator size={"small"} color={colors.gray[100]} />
            ) : (
                children
            )}
        </TouchableOpacity>
    );
}

function Title({ children }: TextProps) {
    return <Text style={s.title}>{children}</Text>;
}

type IconProps = {
    name: ComponentProps<typeof Feather>["name"];
};

function Icon({ name }: IconProps) {
    return <Feather name={name} size={24} color={colors.gray[100]} />;
}

Button.Title = Title;
Button.Icon = Icon;

export { Button };
