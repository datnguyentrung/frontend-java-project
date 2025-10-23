import DropDownPicker from "react-native-dropdown-picker";
import { StyleSheet, View } from "react-native";

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selected: any;
    setSelected: React.Dispatch<React.SetStateAction<any>> | ((value: any) => void);
    list: any[];
    placeholder?: string;
    dropDownDirection?: "TOP" | "BOTTOM" | "AUTO";
}

export default function Dropdown({ open, setOpen, selected, setSelected, list, placeholder, dropDownDirection }: Props) {
    return (
        <View style={[styles.dropdownWrapper, { zIndex: open ? 9999 : 1, elevation: open ? 9999 : 1 }]}>
            <DropDownPicker
                open={open}
                setOpen={setOpen}
                value={selected}
                setValue={setSelected}
                items={list}
                style={styles.dropdownLabel}
                dropDownContainerStyle={styles.dropdownContainer}
                textStyle={styles.dropdownText}
                placeholder={placeholder}
                placeholderStyle={styles.placeholderStyle}
                arrowIconStyle={styles.arrowIcon}
                tickIconStyle={styles.tickIcon}
                zIndex={9999}
                zIndexInverse={1000}
                dropDownDirection={dropDownDirection || "TOP"}
                listMode="SCROLLVIEW"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    dropdownWrapper: {
        minWidth: 0, // Ensures proper flex behavior
        position: 'relative', // Establish stacking context for dropdown
        width: '80%',
        flex: 0,
    },
    dropdownLabel: {
        backgroundColor: '#fff',
        borderColor: '#e1e5e9',
        borderWidth: 1,
        borderRadius: 12,
        minHeight: 50,
        paddingHorizontal: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    dropdownQuarter: {
        backgroundColor: '#fff',
        borderColor: '#e1e5e9',
        borderWidth: 1,
        borderRadius: 12,
        minHeight: 50,
        paddingHorizontal: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    dropdownContainer: {
        backgroundColor: '#fff',
        borderColor: '#e1e5e9',
        borderRadius: 12,
        borderWidth: 1,
        elevation: 5, // Very high elevation for Android
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        marginTop: 4,
        width: '100%',
        zIndex: 9999, // Very high zIndex
        maxHeight: 300
    },
    dropdownText: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    placeholderStyle: {
        color: '#999',
        fontSize: 15,
    },
    arrowIcon: {
        width: 20,
        height: 20,
        tintColor: '#666',
    },
    tickIcon: {
        width: 20,
        height: 20,
        tintColor: '#ff5252',
    },
});