using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace RadioEtzionProject
{
    public static class DB
    {
        public static string connString;


        public static void PullFromDB(string sql, Action<MySqlCommand> configureCommand, Action<MySqlDataReader> doWithEachRow)

        {

            using (MySqlConnection conn = new MySqlConnection(connString))

            {

                conn.Open();

                using (MySqlCommand cmd = new MySqlCommand(sql, conn))

                {

                    if (configureCommand != null)

                    {

                        configureCommand(cmd);

                    }

                    using (MySqlDataReader dr = cmd.ExecuteReader())

                    {

                        while (dr.Read())

                        {

                            doWithEachRow(dr);

                        }

                    }

                }

            }

        }



        public static int ExecuteCommand(string sql, Action<MySqlCommand> configureCommand, bool shouldExecuteScalar = false)

        {

            int rowsAffected = 0;

            using (MySqlConnection conn = new MySqlConnection(connString))

            {

                conn.Open();

                using (MySqlCommand cmd = new MySqlCommand(sql, conn))

                {

                    if (configureCommand != null)

                        configureCommand(cmd);

                    rowsAffected = shouldExecuteScalar ?

                        Convert.ToInt32(cmd.ExecuteScalar()) : cmd.ExecuteNonQuery();

                }

            }





            return rowsAffected;

        }





        public static string GetStringOrNull(this MySqlDataReader dr, int i)

        {

            if (dr.IsDBNull(i))

                return null;

            return dr.GetString(i);

        }



        public static void AddWithValueCheckNull(this MySqlParameterCollection parameters, string parameterName, object value)

        {

            parameters.AddWithValue(parameterName, value == null ? DBNull.Value : value);

        }


    }
}
