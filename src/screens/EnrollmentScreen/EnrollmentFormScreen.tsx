import React, { ComponentProps } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert, Pressable, FlatList } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { PersonalInfo, RegistrationDTO, RegistrationInfo } from '@/types/RegistrationTypes';
import Feather from '@expo/vector-icons/Feather';
import { gray, green, red } from '@styles/colorTypes';
import { formatDateDMY } from '@/utils/format';

import { createRegistration, updateRegistration } from "@/services/registrationService";

import Dropdown from '@/components/common/Dropdown';
import { useClassSessions } from '@/hooks/useClassSessions';
import { useBranches } from '@/hooks/useBranches';
import { beltLevelStyles } from '@/styles/beltLevel';

const { width, height } = Dimensions.get('window');

type Props = {
    setVisibleForm: (visible: boolean) => void;
    setRefreshing: (refreshing: boolean) => void;
    selectedItem?: RegistrationDTO | null;
    setSelectedItem?: (item: RegistrationDTO | null) => void;
};

type FeatherIconName = ComponentProps<typeof Feather>['name'];

type PersonalDataItem = {
    key: string;
    label: string;
    placeholder: string;
    icon: FeatherIconName;
}

const PersonalData: PersonalDataItem[] = [
    { key: 'name', label: 'Họ và tên *', placeholder: 'Nhập họ và tên', icon: 'user' },
    { key: 'birthDate', label: 'Ngày sinh *', placeholder: 'Chọn ngày sinh', icon: 'calendar' },
    { key: 'phone', label: 'Số điện thoại *', placeholder: 'Nhập số điện thoại', icon: 'phone' },
    { key: 'referredBy', label: 'Người giới thiệu', placeholder: 'Nhập tên người giới thiệu (nếu có)', icon: 'users' },
    { key: 'idBranch', label: 'Chi nhánh đăng ký', placeholder: 'Chọn chi nhánh', icon: 'map-pin' },
    { key: 'idClassSession', label: 'Lịch học', placeholder: 'Chọn lịch học', icon: 'clock' },
    { key: 'beltLevel', label: 'Trình độ đai', placeholder: 'Chọn trình độ đai', icon: 'award' },
]

export default function EnrollmentFormScreen({ setVisibleForm, setRefreshing, selectedItem, setSelectedItem }: Props) {
    const [personalInfo, setPersonalInfo] = React.useState<PersonalInfo>({
        name: selectedItem?.personalInfo.name || '',
        birthDate: selectedItem?.personalInfo.birthDate ? new Date(selectedItem.personalInfo.birthDate) : new Date(),
        phone: selectedItem?.personalInfo.phone || '',
        referredBy: selectedItem?.personalInfo.referredBy || '',
    });

    const [registrationInfo, setRegistrationInfo] = React.useState<RegistrationInfo>({
        idBranch: selectedItem?.registrationInfo.idBranch || 0,
        idClassSession: selectedItem?.registrationInfo.idClassSession || [],
        beltLevel: selectedItem?.registrationInfo.beltLevel || 'C10',
    })

    const [isRegister, setIsRegister] = React.useState<boolean>(false);
    const [isDatePickerVisible, setDatePickerVisible] = React.useState(false);
    const [openBranch, setOpenBranch] = React.useState(false);
    const [openBeltLevel, setOpenBeltLevel] = React.useState(false);
    // Sử dụng custom hooks thay vì duplicate logic
    const { branches: branchList, loading: branchesLoading } = useBranches();
    const { classSessions: classSessionList, loading: classSessionsLoading } = useClassSessions();

    // Belt level list
    const beltLevelList = React.useMemo(() => {
        return Object.entries(beltLevelStyles).map(([key, value]) => ({
            value: key,
            label: `Đai ${value.label}`,
        }));
    }, []);

    console.log('registrationInfo.idBranch:', registrationInfo.idBranch, typeof registrationInfo.idBranch);
    console.log('registrationInfo.beltLevel:', registrationInfo.beltLevel, typeof registrationInfo.beltLevel);

    const showDatePicker = () => setDatePickerVisible(true);
    const hideDatePicker = () => setDatePickerVisible(false);

    const handleConfirmDate = (date: Date) => {
        setPersonalInfo((prev) => ({ ...prev, birthDate: date }));
        hideDatePicker();
    };

    const handleChangeStatusForm = () => {
        if (personalInfo.name.trim() === '' || !personalInfo.birthDate || personalInfo.phone.trim() === '') {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc.");
            return;
        }
        setIsRegister(true);
    }

    const handleCancel = () => {
        setVisibleForm(false);
        setPersonalInfo({} as PersonalInfo);
        setIsRegister(false);
        if (selectedItem) {
            setSelectedItem && setSelectedItem(null);
        }
    }

    const handleCreate = async () => {
        try {
            await createRegistration(personalInfo);
            setVisibleForm(false);
            setRefreshing(true);
        } catch (error) {
            Alert.alert("Lỗi", "Đăng ký không thành công. Vui lòng thử lại sau.");
            console.error("Failed to create registration:", error);
        }
    }

    const handleUpdate = async () => {
        try {
            if (!selectedItem) {
                Alert.alert("Lỗi", "Không tìm thấy thông tin đăng ký.");
                return;
            }
            await updateRegistration({
                idRegistration: selectedItem.idRegistration,
                personalInfo: personalInfo,
                registrationInfo: registrationInfo,
            });
            setVisibleForm(false);
            setRefreshing(true);
        } catch (error) {
            Alert.alert("Lỗi", "Cập nhật không thành công. Vui lòng thử lại sau.");
            console.error("Failed to update registration:", error);
        }
    }

    const handleChooseItem = async (item: string, isSelected: boolean) => {
        // Logic xử lý chọn lịch học
        if (isSelected) {
            // Bỏ chọn
            setRegistrationInfo((prev) => ({
                ...prev,
                idClassSession: prev.idClassSession.filter(id => id !== item)
            }));
        } else {
            // Chọn
            setRegistrationInfo((prev) => ({
                ...prev,
                idClassSession: [...prev.idClassSession, item]
            }));
        }
    }

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View />
            <Text style={styles.headerTitle}>Học Viên Mới</Text>
            <TouchableOpacity onPress={() => handleCancel()}>
                <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );

    const renderItemClassSession = ({ item }: { item: { value: string; label: string; idBranch: number } }) => {
        const isSelected = registrationInfo.idClassSession.includes(item.value);
        return (
            <TouchableOpacity key={item.value}
                style={styles.classSessionContainer}
                onPress={() => handleChooseItem(item.value, isSelected)}
            >
                <Feather name={isSelected ? "check-square" : "square"} size={24}
                    color={isSelected ? green[500] : gray[500]}
                />
                <Text>{item.label}</Text>
            </TouchableOpacity>
        );
    }

    const renderClassSessions = () => {
        if (classSessionsLoading) {
            return <Text>Đang tải lịch học...</Text>;
        }
        if (classSessionList.length === 0) {
            return <Text>Không có lịch học khả dụng.</Text>;
        }
        // Lọc lịch học theo chi nhánh
        const grouped = classSessionList.reduce((acc, session) => {
            if (!acc[session.idBranch]) {
                acc[session.idBranch] = [];
            }
            acc[session.idBranch].push(session);
            return acc;
        }, {} as Record<number, { value: string; label: string; idBranch: number }[]>);

        return (
            <View>
                {Object.entries(grouped).map(([idBranch, sessions]) => (
                    <View key={idBranch}>
                        <Text style={styles.branchTitle}>Chi nhánh {idBranch}</Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                            {sessions
                                .sort((a, b) => a.value.localeCompare(b.value))
                                .map(session => (
                                    renderItemClassSession({ item: session })
                                ))}
                        </View>
                    </View>
                ))}
            </View>
        )
    }

    const renderItem = ({ item }: { item: PersonalDataItem }) => {
        if ((item.key === 'idBranch' || item.key === 'idClassSession' || item.key === 'beltLevel') && !isRegister) {
            return null; // bỏ qua idBranch nếu chưa đăng ký
        }

        return (
            <View key={item.key} style={{ marginVertical: 10, width: '100%', marginLeft: 30 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name={item.icon} size={20} style={{ width: 30 }}
                        color={item.key === 'idBranch' || item.key === 'idClassSession' || item.key === 'beltLevel'
                            ? green[500] : red[500]
                        }
                    />
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{item.label}</Text>
                </View>

                {item.key === 'birthDate' ? (
                    <>
                        <TouchableOpacity onPress={showDatePicker} style={styles.textInput}>
                            <Text>{formatDateDMY(personalInfo.birthDate)}</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirmDate}
                            onCancel={hideDatePicker}
                        />
                    </>
                ) : item.key === 'idBranch' ? (
                    <View style={{ marginTop: 10 }}>
                        <Dropdown
                            open={openBranch}
                            setOpen={setOpenBranch}
                            selected={registrationInfo.idBranch}
                            setSelected={(value) => {
                                console.log('Selected branch value:', value, typeof value);
                                setRegistrationInfo(prev => ({ ...prev, idBranch: value }));
                            }}
                            list={branchList.sort((a, b) => a.value - b.value)}
                            placeholder="Chọn chi nhánh"
                        />
                    </View>
                ) : item.key === 'beltLevel' ? (
                    <View style={{ marginTop: 10 }}>
                        <Dropdown
                            open={openBeltLevel}
                            setOpen={setOpenBeltLevel}
                            selected={registrationInfo.beltLevel}
                            setSelected={(value) => {
                                console.log('Selected belt level:', value, typeof value);
                                setRegistrationInfo(prev => ({ ...prev, beltLevel: value }));
                            }}
                            list={beltLevelList}
                            placeholder="Chọn trình độ đai"
                        />
                    </View>
                ) : item.key === 'idClassSession' ? (
                    renderClassSessions()
                ) : (
                    <TextInput
                        style={styles.textInput}
                        placeholder={item.placeholder}
                        placeholderTextColor="#9E9E9E"
                        value={personalInfo ? (personalInfo as any)[item.key] : ''}
                        onChangeText={(text) => setPersonalInfo({ ...personalInfo, [item.key]: text })}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                )}
            </View>
        );
    };

    const renderFooter = () => (
        <View style={{ paddingVertical: 10 }}>
            {/* Registration Status */}
            {!isRegister && (
                <TouchableOpacity style={styles.registerButton}
                    onPress={handleChangeStatusForm}
                >
                    <Text style={{ color: 'white' }}>Đăng ký</Text>
                </TouchableOpacity>
            )}

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancel()}
                >
                    <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => {
                        if (isRegister || selectedItem) {
                            handleUpdate();
                        } else {
                            handleCreate();
                        }
                    }}
                >
                    <Text style={styles.submitButtonText}>
                        {isRegister ? 'Đăng ký' :
                            selectedItem ? 'Lưu thay đổi' : 'Ghi danh'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View >
    );

    return (
        <View style={styles.container}>
            {renderHeader()}
            <FlatList
                data={PersonalData}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
                contentContainerStyle={{ paddingBottom: 20 }}
                // ListHeaderComponent={renderHeader()}
                ListFooterComponent={renderFooter()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width * 0.85,
        height: height * 0.7,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        borderBottomColor: red[500],
        borderBottomWidth: 4,
        overflow: 'hidden',
    },
    headerContainer: {
        backgroundColor: red[500],
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 15,
        paddingBottom: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        borderBottomColor: gray[100],
        borderBottomWidth: 2,
        paddingBottom: 4,
        letterSpacing: 1,
    },
    textInput: {
        backgroundColor: gray[100],
        marginTop: 10,
        width: width * 0.7,
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        width: '100%',
        paddingHorizontal: 30,
        gap: 15,
    },
    cancelButton: {
        flex: 1,
        borderColor: gray[300],
        borderWidth: 2,
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    cancelButtonText: {
        color: gray[600],
        fontSize: 14,
        fontWeight: '600',
    },
    submitButton: {
        flex: 1,
        backgroundColor: red[500],
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: red[500],
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    dateInput: {
        backgroundColor: gray[100],
        marginTop: 10,
        width: width * 0.7,
    },
    registerButton: {
        backgroundColor: green[400],
        alignSelf: 'flex-end',
        marginRight: 30,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        shadowColor: green[400],
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    classSessionContainer: {
        width: "40%",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginVertical: 5,
    },
    branchTitle: {
        borderBottomColor: green[500],
        borderBottomWidth: 2,
        paddingBottom: 2,
        width: "30%",
        marginTop: 10,
        marginLeft: 10,
    }
});