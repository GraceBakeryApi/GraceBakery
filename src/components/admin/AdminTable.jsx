import React, { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Checkbox,
    Paper,
    Toolbar,
    Typography,
    TablePagination,
    Button,
} from "@mui/material";
import Popup from "../Popup";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function AdminTable({ items }) {
    const { entity } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("");
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const currentItem = items.find((item) => item.path.slice(1) === entity);

    const closePopup = () => setPopupVisible(false);

    useEffect(() => {
        if (!currentItem) return;

        const fetchData = async () => {
            try {
                const response = await fetch(`/api${currentItem.path}`);
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки данных для: ${currentItem.title}`);
                }
                const result = await response.json();
                setData(result);
                setColumns(currentItem.columns);
                setLoading(false);
                setError(null);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [currentItem]);

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <ErrorPage message={"Ошибка загрузки: " + error} />;
    }

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortedData = [...data].sort((a, b) => {
        if (order === "asc") {
            return a[orderBy] < b[orderBy] ? -1 : 1;
        }
        return a[orderBy] > b[orderBy] ? -1 : 1;
    });

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(data.map((item) => item.id));
            return;
        }
        setSelected([]);
    };

    const handleRowClick = (id) => {
        setSelected((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((item) => item !== id)
                : [...prevSelected, id]
        );
    };

    const isSelected = (id) => selected.includes(id);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDelete = async () => {
        if (!currentItem || selected.length === 0) return;

        try {
            if (currentItem.deletable === null) return;

            if (currentItem.deletable === false) {
                const selectedRows = data.filter(row => selected.includes(row.id));
                const allInactive = selectedRows.every(row => row.isActive === false);
                const newState = allInactive;

                const singularPath = currentItem.path.endsWith('s')
                    ? currentItem.path.slice(0, -1)
                    : currentItem.path;

                const promises = selected.map(async (id) => {
                    const response = await fetch(
                        `/api${singularPath}/${id}/isactive/${newState}`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(
                            `Ошибка ${response.status}: ${errorText || 'Неизвестная ошибка'}`
                        );
                    }
                    const updatedItem = await response.json();
                    return updatedItem;
                });

                const updatedItems = await Promise.all(promises);

                const updatedData = data.map(row => {
                    const updatedItem = updatedItems.find(item => item.id === row.id);
                    return updatedItem || row;
                });
                setData(updatedData);
            }
            else {
                const singularPath = currentItem.path.endsWith('s')
                    ? currentItem.path.slice(0, -1)
                    : currentItem.path;

                const promises = selected.map(async (id) => {
                    const response = await fetch(`/api${singularPath}/${id}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(
                            `Ошибка ${response.status}: ${errorText || 'Неизвестная ошибка'}`
                        );
                    }

                    const deletedItem = await response.json();
                    return deletedItem;
                });

                await Promise.all(promises);

                const updatedData = data.filter(row => !selected.includes(row.id));
                setData(updatedData);
            }

            setSelected([]);
            setPopupMessage("Операция выполнена успешно");
            setPopupVisible(true);

        } catch (error) {
            console.error('Error:', error);
            setPopupMessage(`Ошибка: ${error.message}`);
            setPopupVisible(true);
        }
    };

    const getDeleteButtonText = () => {
        if (currentItem.deletable === true) {
            return "Удалить выбранные";
        }

        if (currentItem.deletable === false) {
            const selectedRows = data.filter(row => selected.includes(row.id));
            const allInactive = selectedRows.every(row => row.isActive === false);
            return allInactive ? "Активировать выбранные" : "Деактивировать выбранные";
        }

        return ""; //Для null-ов
    };

    const handleEdit = () => {
        if (selected.length === 1) {
            navigate(`/admin/${entity}/edit`, { state: { id: selected[0] } });
        } else {
            setPopupMessage("Выберите ровно одну строку");
            setPopupVisible(true);
        }
    };

    const paginatedData = sortedData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Paper>
            <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">{currentItem.title}</Typography>
                <div>
                    <NavLink to={"/admin/" + entity + "/add"}>
                        <Button
                            variant="contained"
                            color="secondary"
                        >
                            Добавить
                        </Button>
                    </NavLink>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleEdit}
                        disabled={selected.length !== 1}
                        sx={{ marginLeft: 1 }}
                    >
                        Редактировать
                    </Button>
                    {currentItem.deletable !== null && (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                            disabled={selected.length === 0}
                            sx={{ marginLeft: 1 }}
                        >
                            {getDeleteButtonText()}
                        </Button>
                    )}
                </div>
            </Toolbar>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < data.length}
                                    checked={data.length > 0 && selected.length === data.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                            {columns.map((column) => (
                                <TableCell key={column}>
                                    <TableSortLabel
                                        active={orderBy === column}
                                        direction={orderBy === column ? order : "asc"}
                                        onClick={() => handleRequestSort(column)}
                                    >
                                        {column}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.map((row) => (
                            <TableRow
                                key={row.id}
                                hover
                                onClick={() => handleRowClick(row.id)}
                                role="checkbox"
                                aria-checked={isSelected(row.id)}
                                selected={isSelected(row.id)}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox checked={isSelected(row.id)} />
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell key={column}>
                                        {typeof row[column] === 'boolean'
                                            ? row[column]
                                                ? 'Активен'
                                                : 'Неактивен'
                                            : row[column]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Строк на страницу:"
                labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} из ${count}`
                }
            />
            {isPopupVisible && <Popup message={popupMessage} onClose={closePopup} />}
        </Paper>
    );
}

export default AdminTable;