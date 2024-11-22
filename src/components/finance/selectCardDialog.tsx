import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Select,
    MenuItem,
    Typography,
    CircularProgress,
    Box,
    TextField,
    SelectChangeEvent,
} from "@mui/material";
import { getCards } from "@/services/cards";
import NoItemsAvailable from "@/components/noItems";

interface Card {
    number: string;
    balance: number;
    cvv: string;
    erased: boolean;
    expirationDate: string;
    propietary: string;
    type: string;  // Tipo de tarjeta (Débito o Crédito)
}

interface SelectCardDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (cardDetails: { cardNumber: string; cvv: string }) => void;
}

const SelectCardDialog: React.FC<SelectCardDialogProps> = ({ open, onClose, onConfirm }) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [cvv, setCvv] = useState<string>(""); // Almacenar el CVV ingresado
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Fetch cards from the backend
    useEffect(() => {
        const fetchCards = async () => {
            try {
                setLoading(true);
                setError(false);
                const data = await getCards();
                setCards(data || []);
            } catch (err) {
                console.error("Error al obtener las tarjetas:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchCards();
        }
    }, [open]);

    const handleConfirm = () => {
        if (selectedCard && cvv) {
            // Confirmar con la tarjeta seleccionada y el CVV ingresado
            onConfirm({ cardNumber: selectedCard.number, cvv });
        }
    };

    const handleCardChange = (e: SelectChangeEvent<string>) => {
        const card = cards.find((card) => card.number === e.target.value);
        setSelectedCard(card || null);
        setCvv(""); // Limpiar el CVV cuando se cambie la tarjeta
    };

    const isCvvValid = (cvv: string) => /^\d{3,4}$/.test(cvv); // Validar el formato del CVV

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold", fontSize: 18, textAlign: "center" }}>
                Selecciona tu Tarjeta
            </DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box display="flex" justifyContent="center" padding={3}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center">
                        Error al cargar las tarjetas. Intenta de nuevo.
                    </Typography>
                ) : cards.length === 0 ? (
                    <Box display="flex" justifyContent="center">
                        <NoItemsAvailable message="No tienes tarjetas disponibles." />
                    </Box>
                ) : (
                    <>
                        <Typography variant="body1" gutterBottom>
                            Por favor, selecciona la tarjeta que deseas usar:
                        </Typography>
                        <Select
                            value={selectedCard?.number || ""}
                            onChange={handleCardChange}
                            fullWidth
                            variant="outlined"
                            sx={{
                                marginBottom: 2,
                                padding: 1,
                                fontSize: 14,
                                borderRadius: 2,
                                boxShadow: 2,
                            }}
                        >
                            {cards.map((card) => (
                                <MenuItem key={card.number} value={card.number}>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        width="100%"
                                        padding={1.5}
                                        sx={{
                                            borderRadius: 2,
                                            backgroundColor: "#f9f9f9",
                                            boxShadow: 2,
                                            marginBottom: 1,
                                            "&:hover": {
                                                backgroundColor: "#f1f1f1",
                                            },
                                        }}
                                    >
                                        {/* Cuadro que indica si es Débito o Crédito */}
                                        <Box
                                            sx={{
                                                alignItems: "center",
                                                justifyContent: "center",
                                                padding: "4px 12px",
                                                backgroundColor: "#eef5f7",
                                                borderRadius: 2,
                                                marginRight: 2,
                                                fontSize: 12,
                                                fontWeight: "bold",
                                                color: "gray",
                                            }}
                                        >
                                            {card.type === "Débito" ? "Débito" : "Crédito"}
                                        </Box>

                                        <Box display="flex" flexDirection="column" width="100%">
                                            <Typography variant="body2" noWrap sx={{ fontWeight: "bold" }}>
                                                **** **** **** {card.number.slice(-4)}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                Saldo: ${card.balance.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>

                        {selectedCard && (
                            <TextField
                                label="CVV"
                                type="password"
                                variant="outlined"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                                helperText="Introduce el código CVV de la tarjeta"
                                error={!!cvv && !isCvvValid(cvv)}
                            />
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ padding: 2, justifyContent: "center" }}>
                <Button
                    onClick={onClose}
                    color="secondary"
                    sx={{
                        width: "40%",
                        backgroundColor: "#efefef",
                        "&:hover": {
                            backgroundColor: "#d1d1d1",
                        },
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    color="primary"
                    disabled={!selectedCard || !isCvvValid(cvv)}
                    sx={{
                        width: "40%",
                        backgroundColor: "#1976d2",
                        "&:hover": {
                            backgroundColor: "#1565c0",
                        },
                    }}
                >
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SelectCardDialog;
