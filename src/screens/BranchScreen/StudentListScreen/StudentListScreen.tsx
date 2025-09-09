import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { getStudentByBranch, getAllStudents } from '@/services/studentsService';
import taekwondo from '@assets/taekwondo.jpg';
import SearchBar from '@/components/common/SearchBar';

interface Student {
    name: string;
    studentLevel: string;
    branch: number;
}

export default function StudentListScreen({ branch_id }: { branch_id: number | null }) {
    const [listStudent, setListStudent] = useState<Student[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            if (!branch_id) {
                const data = await getAllStudents();
                setListStudent(data || []);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                console.log('🔍 Fetching students for branch_id:', branch_id);
                const data = await getStudentByBranch(branch_id);
                console.log('📊 Students data received:', data);
                setListStudent(data || []);
            } catch (err) {
                console.error('❌ Error fetching students:', err);
                setError('Không thể tải danh sách học viên');
                setListStudent([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [branch_id]);

    const renderStudentItem = ({ item, index }: { item: Student; index: number }) => (
        <View style={[styles.studentItem, {
            backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FFEBEE',
        }]}>
            <View style={styles.studentIndex}>
                <Text style={styles.indexText}>{index + 1}</Text>
            </View>

            <View style={styles.studentInfo}>
                <View style={styles.nameSection}>
                    <Text style={styles.studentName}>{item.name}</Text>
                    <View style={styles.nameUnderline} />
                </View>

                <View style={styles.detailsRow}>
                    <View style={styles.levelContainer}>
                        <View style={styles.levelIcon}>
                            <Text style={styles.levelIconText}>🥋</Text>
                        </View>
                        <View style={styles.levelTextContainer}>
                            <Text style={styles.levelLabel}>Cấp đai</Text>
                            <Text style={styles.studentLevel}>{item.studentLevel}</Text>
                        </View>
                    </View>

                    <View style={styles.branchContainer}>
                        <View style={styles.branchIcon}>
                            <Text style={styles.branchIconText}>🏢</Text>
                        </View>
                        <View style={styles.branchTextContainer}>
                            {/* <Text style={styles.branchLabel}>CS</Text> */}
                            <View style={styles.branchBadge}>
                                <Text style={styles.branchText}>{item.branch}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.imageContainer}>
                <Image source={taekwondo} style={styles.studentImage} />
                {/* <View style={styles.imageOverlay} /> */}
                <View style={styles.imageBorder} />
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#FF5252" />
                <Text style={styles.loadingText}>Đang tải danh sách học viên...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Danh sách học viên</Text>
                <View>
                    <Text style={styles.headerSubtitle}>
                        Tổng cộng: {listStudent.length} học viên
                    </Text>
                    <SearchBar searchText={searchText} setSearchText={setSearchText} content='học viên' />
                </View>
            </View>

            <FlatList
                data={listStudent.sort((a, b) => a.name.localeCompare(b.name))}
                renderItem={renderStudentItem}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            Không có học viên nào trong chi nhánh này
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#FFCDD2',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FF5252',
        marginBottom: 4,
    },
    // headerSubtitleContainer: {
    //     flexDirection: 'row',
    //     // alignItems: 'center',
    // },
    headerSubtitle: {
        fontSize: 14,
        color: '#757575',
    },
    studentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 16,
        borderRadius: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#FF5252',
        shadowColor: '#FF5252',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    studentIndex: {
        width: 30,
        height: 30,
        borderRadius: 25,
        backgroundColor: '#FF5252',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        shadowColor: '#FF5252',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    indexText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#fff',
    },
    studentInfo: {
        flex: 1,
        // paddingRight: 1,
    },
    nameSection: {
        marginBottom: 12,
    },
    studentName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#263238',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    nameUnderline: {
        height: 2,
        backgroundColor: '#FF5252',
        width: '70%',
        borderRadius: 1,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    levelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    levelIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#FFCDD2',
    },
    levelIconText: {
        fontSize: 16,
    },
    levelTextContainer: {
        flex: 1,
    },
    levelLabel: {
        fontSize: 12,
        color: '#757575',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    studentLevel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FF5252',
    },
    branchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    branchIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#FFCDD2',
    },
    branchIconText: {
        fontSize: 16,
    },
    branchTextContainer: {
        flex: 1,
    },
    branchLabel: {
        fontSize: 12,
        color: '#757575',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    branchBadge: {
        backgroundColor: '#FF5252',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    branchText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    imageContainer: {
        position: 'relative',
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: 'hidden',
    },
    studentImage: {
        width: '100%',
        height: '100%',
        borderRadius: 35,
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 82, 82, 0.05)',
        borderRadius: 35,
    },
    imageBorder: {
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderWidth: 2,
        borderColor: '#FFCDD2',
        borderRadius: 37,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
        lineHeight: 22,
    },
    loadingText: {
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
        marginTop: 12,
    },
    errorText: {
        fontSize: 16,
        color: '#F44336',
        textAlign: 'center',
        lineHeight: 22,
    },
});
