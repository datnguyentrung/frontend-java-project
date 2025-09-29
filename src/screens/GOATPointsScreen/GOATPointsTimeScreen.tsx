import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { getStudentStartDate } from "@/services/training/studentsService";
import { UserInfo } from '@/types/types';
import DropDownPicker from "react-native-dropdown-picker";

type Props = {
    userInfo: UserInfo | null;
    selectedYear: number;
    setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
    selectedQuarter: number;
    setSelectedQuarter: React.Dispatch<React.SetStateAction<number>>;
}

const listQuarter = [
    { label: "Quý I", value: 1 },
    { label: "Quý II", value: 2 },
    { label: "Quý III", value: 3 },
    { label: "Quý IV", value: 4 },
];

export default function GOATPointsTimeScreen({ userInfo, selectedYear, setSelectedYear, selectedQuarter, setSelectedQuarter }: Props) {
    const [listYear, setListYear] = useState<number[]>([]);
    const [openYear, setOpenYear] = useState(false);
    const [openQuarter, setOpenQuarter] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            if (userInfo?.idUser) {
                try {
                    const startDateStr = await getStudentStartDate(userInfo.idUser);
                    const startDate = new Date(startDateStr);
                    // console.log("Student Start Date :", startDate);
                    const years = [];
                    for (let year = startDate.getFullYear(); year <= new Date().getFullYear(); year++) {
                        years.push(year);
                    }
                    setListYear(years);
                } catch (error) {
                    console.error("Error fetching student start date:", error);
                }
            }
        }
        fetch();
    }, [userInfo?.idUser]);

    // console.log("List of Years:", listYear);

    // Function to handle dropdown close when other dropdown opens
    useEffect(() => {
        if (openYear && openQuarter) {
            setOpenQuarter(false);
        }
    }, [openYear]);

    useEffect(() => {
        if (openQuarter && openYear) {
            setOpenYear(false);
        }
    }, [openQuarter]);

    return (
        <View style={styles.container}>
            <View style={styles.dropdownRow}>
                <View style={[styles.dropdownWrapper, { zIndex: openYear ? 9999 : 1, elevation: openYear ? 9999 : 1 }]}>
                    <Text style={styles.dropdownLabel}>Năm học</Text>
                    <DropDownPicker
                        open={openYear}
                        setOpen={setOpenYear}
                        value={selectedYear}
                        setValue={setSelectedYear}
                        items={listYear.map(year => ({ label: year.toString(), value: year }))}
                        style={styles.dropdownYear}
                        dropDownContainerStyle={styles.dropdownContainer}
                        textStyle={styles.dropdownText}
                        placeholder="Chọn năm"
                        placeholderStyle={styles.placeholderStyle}
                        arrowIconStyle={styles.arrowIcon}
                        tickIconStyle={styles.tickIcon}
                        zIndex={9999}
                        zIndexInverse={1000}
                        // dropDownDirection="TOP"
                        listMode="SCROLLVIEW"
                    />
                </View>
                <View style={[styles.dropdownWrapper, { zIndex: openQuarter ? 9998 : 1, elevation: openQuarter ? 9998 : 1 }]}>
                    <Text style={styles.dropdownLabel}>Quý</Text>
                    <DropDownPicker
                        open={openQuarter}
                        setOpen={setOpenQuarter}
                        value={selectedQuarter}
                        setValue={setSelectedQuarter}
                        items={listQuarter.map(quarter => ({ label: quarter.label, value: quarter.value }))}
                        style={styles.dropdownQuarter}
                        dropDownContainerStyle={styles.dropdownContainer}
                        textStyle={styles.dropdownText}
                        placeholder="Chọn quý"
                        placeholderStyle={styles.placeholderStyle}
                        arrowIconStyle={styles.arrowIcon}
                        tickIconStyle={styles.tickIcon}
                        zIndex={9998}
                        zIndexInverse={1000}
                        // dropDownDirection="TOP"
                        listMode="SCROLLVIEW"
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
    },
    dropdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
    },
    dropdownWrapper: {
        flex: 1,
        minWidth: 0, // Ensures proper flex behavior
        position: 'relative', // Establish stacking context for dropdown
    },
    dropdownLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        paddingLeft: 4,
    },
    dropdownYear: {
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
        elevation: 9999, // Very high elevation for Android
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        marginTop: 4,
        position: 'absolute', // Make dropdown items float above everything
        width: '100%',
        zIndex: 9999, // Very high zIndex
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