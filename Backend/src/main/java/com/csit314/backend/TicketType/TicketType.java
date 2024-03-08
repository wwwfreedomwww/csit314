package com.csit314.backend.TicketType;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import com.csit314.backend.db.SQLConnection;

public class TicketType {
    private Integer id = -1;
    private String typeName = "";
    private Integer price = -1;
    private String status = "";

    public TicketType() {
        id = -1;
        typeName = "";
        price = -1;
        status = "";
    }

    // To accept existing profile ids
    public TicketType(Integer id) {
        this.id = id;
    }

    public TicketType(String typeName, Integer price) {
        this.typeName = typeName;
        this.price = price;
    }

    public TicketType(Integer id, String typeName, Integer price, String status) {
        this.id = id;
        this.typeName = typeName;
        this.price = price;
        this.status = status;
    }

    public TicketType(Integer id, String typeName) {
        super();
        this.id = id;
        this.typeName = typeName;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String save(TicketType ticketType) throws SQLException {
        Connection connection = null;
        try {
            SQLConnection sqlConnection = new SQLConnection();
            connection = sqlConnection.getConnection();
            String query = "INSERT INTO TicketType (typeName, price) VALUES (?, ?)";
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, ticketType.typeName);
            statement.setInt(2, ticketType.price);

            statement.executeUpdate();
            return "Success";
        } catch (SQLException e) {
            System.out.println(e);
            return "Failure";
        } finally {
            // Close SQL connection when not in use
            if (connection != null) {
                connection.close();
            }
        }
    }

    public TicketType get(Integer id) throws SQLException {
        Connection connection = null;
        try {
            SQLConnection sqlConnection = new SQLConnection();
            connection = sqlConnection.getConnection();
            String query = "SELECT * FROM TicketType WHERE id = ?";
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setInt(1, id);
            statement.setMaxRows(1);
            ResultSet resultSet = statement.executeQuery();
            if (!resultSet.next()) {
                return null;
            }
            String typeName = resultSet.getString("typeName");
            Integer price = resultSet.getInt("price");
            String status = resultSet.getString("status");
            TicketType result = new TicketType(id, typeName, price, status);
            return result;
        } catch (SQLException e) {
            System.out.println(e);
            return null;
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
    }

    public ArrayList<TicketType> listAll() throws SQLException {
        Connection connection = null;
        try {
            SQLConnection sqlConnection = new SQLConnection();
            connection = sqlConnection.getConnection();
            String query = "SELECT * FROM TicketType";
            PreparedStatement statement = connection.prepareStatement(query);
            ResultSet resultSet = statement.executeQuery();
            ArrayList<TicketType> results = new ArrayList<>();
            while (resultSet.next()) {
                // Get the data from the current row
                Integer id = resultSet.getInt("id");
                String typeName = resultSet.getString("typeName");
                Integer price = resultSet.getInt("price");
                String status = resultSet.getString("status");
                // Convert the data into an object that can be sent back to boundary
                TicketType result = new TicketType(id, typeName, price, status);
                results.add(result);
            }
            return results;
        } catch (SQLException e) {
            System.out.println(e);
            return null;
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
    }

    public Boolean update(TicketType ticketType)
            throws SQLException {
        Connection connection = null;
        try {
            SQLConnection sqlConnection = new SQLConnection();
            connection = sqlConnection.getConnection();
            String query = "UPDATE TicketType SET typeName = ?, price = ? WHERE id = ?";
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, ticketType.typeName);
            statement.setInt(2, ticketType.price);
            statement.setInt(3, ticketType.id);
            statement.executeUpdate();
            return true;
        } catch (SQLException e) {
            System.out.println(e);
            return false;
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
    }

    public ArrayList<TicketType> search(String q) throws SQLException {
        Connection connection = null;
        try {
            SQLConnection sqlConnection = new SQLConnection();
            connection = sqlConnection.getConnection();
            String query = "SELECT * FROM TicketType WHERE typeName LIKE ?";
            PreparedStatement statement = connection.prepareStatement(query);
            System.out.println(q);
            statement.setString(1, "%" + q + "%");
            ResultSet resultSet = statement.executeQuery();
            ArrayList<TicketType> results = new ArrayList<>();
            while (resultSet.next()) {
                // Get the data from the current row
                Integer id = resultSet.getInt("id");
                String typeName = resultSet.getString("typeName");
                Integer price = resultSet.getInt("price");
                String status = resultSet.getString("status");
                // Convert the data into an object that can be sent back to boundary
                TicketType result = new TicketType(id, typeName, price, status);
                results.add(result);
            }
            return results;
        } catch (SQLException e) {
            System.out.println(e);
            return null;
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
    }

    public Boolean hide(Integer id) throws SQLException {
        Connection connection = null;
        try {
            SQLConnection sqlConnection = new SQLConnection();
            connection = sqlConnection.getConnection();
            String query = "UPDATE TicketType SET status = ? WHERE id = ?";
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, "Not Available");
            statement.setInt(2, id);
            statement.executeUpdate();
            return true;
        } catch (SQLException e) {
            System.out.println(e);
            return false;
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
    }

    public Boolean unhide(Integer id) throws SQLException {
        Connection connection = null;
        try {
            SQLConnection sqlConnection = new SQLConnection();
            connection = sqlConnection.getConnection();
            String query = "UPDATE TicketType SET status = ? WHERE id = ?";
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, "Available");
            statement.setInt(2, id);
            statement.executeUpdate();
            return true;
        } catch (SQLException e) {
            System.out.println(e);
            return false;
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
    }
}
