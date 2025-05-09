{
  tokenData && (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Minting Successful</CardTitle>
        <CardDescription>
          Share the QR code with attendees to claim their tokens.
        </CardDescription>
      </CardHeader>
      <CardContent>{/* <QRCodeDisplay data={tokenData} /> */}</CardContent>
      <CardFooter className="flex justify-end">
        <p className="text-sm text-gray-500">
          Token ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
        </p>
      </CardFooter>
    </Card>
  );
}
