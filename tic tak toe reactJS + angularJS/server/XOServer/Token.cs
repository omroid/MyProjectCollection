namespace XO_Reactjs
{
    public class Token
    {
        public string value { get; set; }

        public Token()
        {
            this.value = System.Guid.NewGuid().ToString();
        }

        public override int GetHashCode()
        {
            return this.value.GetHashCode();
        }

    }
}
