import {
    View, Text,
    StyleSheet, TextInput, FlatList,
    TouchableOpacity, SafeAreaView, Dimensions,
} from 'react-native';
import { getAllBranches } from '@/services/branchesService';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import StudentListScreen from '@/screens/BranchScreen/StudentListScreen/StudentListScreen';
import SearchBar from '@/components/common/SearchBar';
import { Branch } from '@/store/types';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = padding (16*2) + gap (16)

export default function BranchScreen() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [searchText, setSearchText] = useState('');
    const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

    useEffect(() => {
        const fetchBranches = async () => {
            const data = await getAllBranches();
            setBranches(data);
            setFilteredBranches(data);
        };

        fetchBranches();
    }, []);

    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredBranches(branches);
        } else {
            const filtered = branches.filter(branch =>
                branch.title.toLowerCase().includes(searchText.toLowerCase())
                // ||branch.address.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredBranches(filtered);
        }
    }, [searchText, branches]);

    const handleBranchSelect = (branchId: number) => {
        if (branchId === selectedBranchId) {
            setSelectedBranchId(null);
        } else {
            setSelectedBranchId(branchId);
        }
    };

    const renderBranchCard = ({ item }: { item: Branch; index: number }) => {
        return (
            <TouchableOpacity
                style={[styles.card, {
                    shadowColor: item.idBranch !== selectedBranchId ? '#FF5252' : '#2196F3',
                }]}
                onPress={() => handleBranchSelect(item.idBranch)}
                activeOpacity={0.85}
            >
                <View style={[styles.cardContainer, {
                    borderColor: item.idBranch !== selectedBranchId ? '#FFCDD2' : '#BBDEFB',
                }]}>
                    {/* Background gradient effect */}
                    <LinearGradient
                        colors={item.idBranch !== selectedBranchId
                            ? ['#FFEBEE', '#FFFFFF', '#FFEBEE']
                            : ['#E3F2FD', '#FFFFFF', '#E3F2FD']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardBackground}
                    />

                    {/* Subtle center glow */}
                    <View style={[styles.centerGlow, {
                        backgroundColor: item.idBranch !== selectedBranchId ? '#FFE0E6' : '#E1F5FE'
                    }]} />

                    <View style={styles.cardIconSection}>
                        <View style={[styles.iconContainer, {
                            backgroundColor: item.idBranch !== selectedBranchId ? '#FFEBEE' : '#E3F2FD',
                            borderColor: item.idBranch !== selectedBranchId ? '#FFCDD2' : '#BBDEFB',
                        }]}>
                            <View style={[styles.iconGlow, {
                                backgroundColor: item.idBranch !== selectedBranchId ? '#FF5252' : '#2196F3',
                            }]} />
                            <Ionicons
                                name="business"
                                size={24}
                                color={item.idBranch !== selectedBranchId ? '#FF5252' : '#2196F3'}
                            />
                        </View>
                    </View>

                    <View style={styles.cardContent}>
                        <Text style={styles.branchName} numberOfLines={2}>
                            {item.title}
                        </Text>
                    </View>

                    {/* Animated accent bars */}
                    <View style={[styles.cardAccent, {
                        backgroundColor: item.idBranch !== selectedBranchId ? '#FF5252' : '#2196F3',
                    }]} />
                    <View style={[styles.cardAccentSecondary, {
                        backgroundColor: item.idBranch !== selectedBranchId ? '#FFAB91' : '#90CAF9',
                    }]} />
                </View>
            </TouchableOpacity>
        );
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Chi nhánh</Text>
            <Text style={styles.headerSubtitle}>
                Tìm kiếm và chọn chi nhánh phù hợp
            </Text>
        </View>
    );

    const renderSearchBar = () => (
        <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#FF5252" style={styles.searchIcon} />
                <TextInput
                    placeholder="Tìm kiếm chi nhánh..."
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholderTextColor="#BDBDBD"
                />
                {searchText.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setSearchText('')}
                        style={styles.clearButton}
                    >
                        <Ionicons name="close-circle" size={20} color="#BDBDBD" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>Không tìm thấy chi nhánh</Text>
            <Text style={styles.emptyStateSubtitle}>
                Thử tìm kiếm với từ khóa khác
            </Text>
        </View>
    );


    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={filteredBranches}
                renderItem={({ item, index }) => renderBranchCard({ item, index })}
                keyExtractor={(item) => item.idBranch.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                ListHeaderComponent={
                    <>
                        {renderHeader()}
                        <SearchBar searchText={searchText} setSearchText={setSearchText} content='chi nhánh' />
                    </>
                }
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<StudentListScreen branch_id={selectedBranchId} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    listContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FF5252',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#757575',
        fontWeight: '400',
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: '#fff',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 2,
        borderColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 0,
    },
    clearButton: {
        padding: 4,
    },
    row: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    card: {
        width: cardWidth,
        height: 160,
        borderRadius: 20,
        marginHorizontal: 4,
        shadowColor: '#FF5252',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 8,
        overflow: 'hidden',
    },
    cardContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1.5,
        overflow: 'hidden',
        position: 'relative',
    },
    cardBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.7,
    },
    centerGlow: {
        position: 'absolute',
        top: '30%',
        left: '30%',
        right: '30%',
        bottom: '30%',

        borderRadius: 30,
        opacity: 0.3,
    },
    cardIconSection: {
        paddingTop: 26,
        paddingHorizontal: 20,
        alignItems: 'center',
        zIndex: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFCDD2',
        shadowColor: '#FF5252',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        position: 'relative',
    },
    iconGlow: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FF5252',
        opacity: 0.1,
        top: 6,
        left: 6,
    },
    cardContent: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        justifyContent: 'center',
        zIndex: 2,
        minHeight: 60,
    },
    branchName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#263238',
        textAlign: 'center',
        lineHeight: 20,
        letterSpacing: 0.25,
        textShadowColor: 'rgba(255, 82, 82, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        paddingHorizontal: 4,
    },
    cardAccent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: '#FF5252',
    },
    cardAccentSecondary: {
        position: 'absolute',
        bottom: 4,
        left: '20%',
        right: '20%',
        height: 2,
        backgroundColor: '#FFAB91',
        opacity: 0.6,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
});